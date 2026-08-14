package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.DriverUpdateRequest;
import com.rentaltaxi.dto.response.DriverResponse;
import com.rentaltaxi.entity.Booking;
import com.rentaltaxi.entity.Driver;
import com.rentaltaxi.entity.Feedback;
import com.rentaltaxi.entity.enums.BookingStatus;
import com.rentaltaxi.entity.enums.DriverStatus;
import com.rentaltaxi.repository.BookingRepository;
import com.rentaltaxi.repository.DriverRepository;
import com.rentaltaxi.repository.FeedbackRepository;
import com.rentaltaxi.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepo;
    private final BookingRepository bookingRepo;   // ADDED
    private final FeedbackRepository feedbackRepo; // ADDED

    @Override
    public DriverResponse getCurrentDriver(String username) {
        Driver driver = driverRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return mapToResponse(driver);
    }

    @Override
    @Transactional
    public DriverResponse updateDriver(String username, DriverUpdateRequest request) {
        Driver driver = driverRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (request.getFullName() != null) driver.setFullName(request.getFullName());
        if (request.getPhone() != null) driver.setPhone(request.getPhone());
        if (request.getLicenseNumber() != null) driver.setLicenseNumber(request.getLicenseNumber());
        if (request.getStatus() != null) driver.setStatus(DriverStatus.valueOf(request.getStatus()));
        if (request.getEmail() != null) driver.setEmail(request.getEmail());

        return mapToResponse(driverRepo.save(driver));
    }

    @Override
    public DriverResponse getDriverById(Integer driverId) {
        Driver driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return mapToResponse(driver);
    }

    @Override
    @Transactional
    public DriverResponse updateDriverStatus(Integer driverId, DriverStatus status) {
        Driver driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setStatus(status);
        return mapToResponse(driverRepo.save(driver));
    }

    @Override
    public List<DriverResponse> getAllDrivers() {
        return driverRepo.findAll().stream()
                .filter(driver -> !driver.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public DriverResponse updateDriver(Integer driverId, DriverUpdateRequest request) {
        Driver driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + driverId));

        if (request.getFullName() != null) driver.setFullName(request.getFullName());
        if (request.getPhone() != null) driver.setPhone(request.getPhone());
        if (request.getEmail() != null) driver.setEmail(request.getEmail());
        if (request.getLicenseNumber() != null) driver.setLicenseNumber(request.getLicenseNumber());

        if (request.getStatus() != null) {
            try {
                driver.setStatus(DriverStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status value: " + request.getStatus());
            }
        }

        return mapToResponse(driverRepo.save(driver));
    }

    @Override
    public Double getDriverEarnings(String username) {
        Driver driver = driverRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<Booking> completedBookings = bookingRepo.findByDriver_DriverIdAndStatus(
                driver.getDriverId(), BookingStatus.COMPLETED
        );

        return completedBookings.stream()
                .mapToDouble(Booking::getFare)
                .sum();
    }

    @Override
    public Double getDriverAverageRating(String username) {
        Driver driver = driverRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // FIXED: Changed driver.getId() to driver.getDriverId()
        List<Feedback> feedbacks = feedbackRepo.findByBooking_Driver_DriverId(driver.getDriverId());

        if (feedbacks.isEmpty()) {
            return 0.0;
        }

        double avg = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        // Round to 1 decimal place
        return Math.round(avg * 10.0) / 10.0;
    }

    private DriverResponse mapToResponse(Driver driver) {
        DriverResponse response = new DriverResponse();
        response.setDriverId(driver.getDriverId());
        response.setUsername(driver.getUsername());
        response.setEmail(driver.getEmail());
        response.setFullName(driver.getFullName());
        response.setPhone(driver.getPhone());
        response.setLicenseNumber(driver.getLicenseNumber());
        response.setStatus(driver.getStatus() != null ? driver.getStatus().name() : null);
        response.setCreatedAt(driver.getCreatedAt());
        response.setUpdatedAt(driver.getUpdatedAt());

        if (driver.getCab() != null) {
            response.setCabId(driver.getCab().getCabId());
        } else {
            response.setCabId(null);
        }

        return response;
    }

    // --- UPDATED CRITICAL FIX FOR DELETION ---
    @Override
    @Transactional
    public void deleteDriver(Integer id) {
        Driver driver = driverRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver with ID " + id + " not found."));
        
        // We do not delete the row, we just mark it as deleted!
        driver.setDeleted(true); 
        driverRepo.save(driver);
    }
}