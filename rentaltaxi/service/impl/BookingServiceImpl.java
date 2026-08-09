package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.BookingRequest;
import com.rentaltaxi.dto.request.BookingUpdateRequest;
import com.rentaltaxi.dto.response.BookingResponse;
import com.rentaltaxi.entity.*;
import com.rentaltaxi.entity.enums.BookingStatus;
import com.rentaltaxi.repository.*;
import com.rentaltaxi.service.BookingService;
import com.rentaltaxi.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
	
    private final BookingRepository bookingRepo;
    private final CustomerRepository customerRepo;
    private final DriverRepository driverRepo;
    private final CabRepository cabRepo;
    private final SystemSettingsRepository settingsRepo;
    private final PaymentRepository paymentRepo;
    private final FeedbackRepository feedbackRepo;
    private final WebSocketNotificationService webSocketNotificationService;
    private final SimpMessagingTemplate messagingTemplate; // For direct WebSocket broadcast

    // ============================================================
    // 1. CREATE BOOKING
    // ============================================================
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String customerUsername) {
        Customer customer = customerRepo.findByUsername(customerUsername)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = new Booking();
        booking.setPickupLocation(request.getPickupLocation());
        booking.setDropoffLocation(request.getDropoffLocation());
        booking.setPickupTime(request.getPickupTime());
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCustomer(customer);
        booking.setFare(0.0);
        booking.setDistance(0.0);

        return mapToResponse(bookingRepo.save(booking));
    }

    // ============================================================
    // 2. CANCEL BOOKING (Customer)
    // ============================================================
    @Override
    @Transactional
    public BookingResponse cancelBooking(Integer bookingId, String customerUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomer().getUsername().equals(customerUsername)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepo.save(booking));
    }

    // ============================================================
    // 3. ACCEPT BOOKING (Driver) – FIXED
    // ============================================================
    @Override
    @Transactional
    public BookingResponse acceptBooking(Integer bookingId, String driverUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Driver driver = driverRepo.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        booking.setDriver(driver);
        booking.setStatus(BookingStatus.ACCEPTED);

        Booking saved = bookingRepo.save(booking);
        BookingResponse response = mapToResponse(saved);

        // ─── Build WebSocket payload ──────────────────────────────
        Map<String, Object> payload = new HashMap<>();
        payload.put("bookingId", saved.getBookingId());
        payload.put("status", saved.getStatus().name());
        payload.put("driverId", driver.getDriverId());

        Map<String, String> driverMap = new HashMap<>();
        driverMap.put("fullName", driver.getFullName());
        driverMap.put("phone", driver.getPhone());
        driverMap.put("licenseNumber", driver.getLicenseNumber());
        driverMap.put("username", driver.getUsername());
        driverMap.put("email", driver.getEmail());

        // Get cab from driver (not booking)
        String cabModel = (driver.getCab() != null) ? driver.getCab().getModel() : "N/A";
        String cabPlate = (driver.getCab() != null) ? driver.getCab().getPlateNumber() : "N/A";
        driverMap.put("cabModel", cabModel);
        driverMap.put("cabPlate", cabPlate);

        payload.put("driver", driverMap);

        // ─── Broadcast to customer via WebSocket ────────────────────
        messagingTemplate.convertAndSend("/topic/booking", payload);

        return response;
    }

    // ============================================================
    // 4. REJECT BOOKING (Driver)
    // ============================================================
    @Override
    @Transactional
    public BookingResponse rejectBooking(Integer bookingId, String driverUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Just verify driver exists
        driverRepo.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        booking.setStatus(BookingStatus.REJECTED);
        Booking saved = bookingRepo.save(booking);
        BookingResponse response = mapToResponse(saved);
        webSocketNotificationService.notifyBookingRejected(response);
        return response;
    }

    // ============================================================
    // 5. START TRIP (Driver)
    // ============================================================
    @Override
    @Transactional
    public BookingResponse startTrip(Integer bookingId, String driverUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Driver driver = driverRepo.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (booking.getDriver() == null) {
            booking.setDriver(driver);
        } else if (!booking.getDriver().getDriverId().equals(driver.getDriverId())) {
            throw new RuntimeException("You are not authorized to start this trip");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Only ACCEPTED bookings can be started");
        }

        booking.setStatus(BookingStatus.IN_PROGRESS);
        Booking saved = bookingRepo.save(booking);
        BookingResponse response = mapToResponse(saved);
        webSocketNotificationService.notifyTripStarted(response);
        return response;
    }

    // ============================================================
    // 6. COMPLETE TRIP (Driver) – Auto‑calculate fare
    // ============================================================
    @Override
    @Transactional
    public BookingResponse completeBooking(Integer bookingId, String driverUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getDriver() == null || !booking.getDriver().getUsername().equals(driverUsername)) {
            throw new RuntimeException("You are not authorized to complete this trip");
        }

        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Only IN_PROGRESS bookings can be completed");
        }

        SystemSettings settings = settingsRepo.findById(1L)
                .orElseThrow(() -> new RuntimeException("System settings not found"));

        Double distance = booking.getDistance();
        if (distance == null || distance == 0.0) {
            distance = 5.0;
            booking.setDistance(distance);
        }

        double fare = settings.getBaseFare() + (settings.getPerKmRate() * distance);
        booking.setFare(Math.round(fare * 100.0) / 100.0);

        booking.setStatus(BookingStatus.COMPLETED);
        Booking saved = bookingRepo.save(booking);
        BookingResponse response = mapToResponse(saved);
        webSocketNotificationService.notifyBookingCompleted(response);
        return response;
    }

    // ============================================================
    // 7. UPDATE DRIVER LOCATION (Real‑time GPS)
    // ============================================================
    @Override
    @Transactional
    public BookingResponse updateDriverLocation(Integer bookingId, Double lat, Double lng) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setDriverLat(lat);
        booking.setDriverLng(lng);
        Booking saved = bookingRepo.save(booking);
        BookingResponse response = mapToResponse(saved);
        webSocketNotificationService.notifyDriverLocationUpdate(response);
        return response;
    }

    // ============================================================
    // 8. GET BOOKING BY ID
    // ============================================================
    @Override
    public BookingResponse getBookingById(Integer bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    // ============================================================
    // 9. GET BOOKINGS BY CUSTOMER
    // ============================================================
    @Override
    public List<BookingResponse> getBookingsByCustomer(String customerUsername) {
        Customer customer = customerRepo.findByUsername(customerUsername)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        List<Booking> bookings = bookingRepo.findByCustomer_CustomerId(customer.getCustomerId());
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking b : bookings) {
            responses.add(mapToResponse(b));
        }
        return responses;
    }

    // ============================================================
    // 10. GET BOOKINGS BY DRIVER
    // ============================================================
    @Override
    public List<BookingResponse> getBookingsByDriver(String driverUsername) {
        Driver driver = driverRepo.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        List<Booking> bookings = bookingRepo.findByDriver_DriverId(driver.getDriverId());
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking b : bookings) {
            responses.add(mapToResponse(b));
        }
        return responses;
    }

    // ============================================================
    // 11. GET BOOKINGS BY STATUS
    // ============================================================
    @Override
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        List<Booking> bookings = bookingRepo.findByStatus(status);
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking b : bookings) {
            responses.add(mapToResponse(b));
        }
        return responses;
    }

    // ============================================================
    // 12. GET ALL BOOKINGS (Admin)
    // ============================================================
    @Override
    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepo.findAll();
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking b : bookings) {
            responses.add(mapToResponse(b));
        }
        return responses;
    }

    // ============================================================
    // 13. UPDATE BOOKING (Admin)
    // ============================================================
    @Override
    @Transactional
    public BookingResponse updateBooking(Integer bookingId, BookingUpdateRequest request) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }
        if (request.getFare() != null) {
            booking.setFare(request.getFare());
        }
        return mapToResponse(bookingRepo.save(booking));
    }

    // ============================================================
    // 14. DELETE BOOKING (Admin) – Cascade delete
    // ============================================================
    @Override
    @Transactional
    public void deleteBooking(Integer bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        if (booking.getPayment() != null) {
            paymentRepo.delete(booking.getPayment());
        }
        if (booking.getFeedback() != null) {
            feedbackRepo.delete(booking.getFeedback());
        }
        bookingRepo.delete(booking);
    }

    // ============================================================
    // PRIVATE MAPPER
    // ============================================================
    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setPickupLocation(booking.getPickupLocation());
        response.setDropoffLocation(booking.getDropoffLocation());
        response.setPickupTime(booking.getPickupTime());
        response.setBookingTime(booking.getBookingTime());
        response.setStatus(booking.getStatus());
        response.setFare(booking.getFare());
        response.setDistance(booking.getDistance());
        response.setCustomerId(booking.getCustomer().getCustomerId());

        if (booking.getDriver() != null) {
            response.setDriverId(booking.getDriver().getDriverId());
        } else {
            response.setDriverId(null);
        }

        if (booking.getPayment() != null) {
            response.setPaymentId(booking.getPayment().getPaymentId());
        }
        if (booking.getFeedback() != null) {
            response.setFeedbackId(booking.getFeedback().getFeedbackId());
        }

        return response;
    }
}
