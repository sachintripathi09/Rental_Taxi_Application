package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.BookingRequest;
import com.rentaltaxi.dto.request.BookingUpdateRequest;
import com.rentaltaxi.dto.response.BookingResponse;
import com.rentaltaxi.entity.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    // ─── Customer actions ──────────────────────────────
    BookingResponse createBooking(BookingRequest request, String customerUsername);
    BookingResponse cancelBooking(Integer bookingId, String customerUsername);

    // ─── Driver actions ────────────────────────────────
    BookingResponse acceptBooking(Integer bookingId, String driverUsername);
    BookingResponse rejectBooking(Integer bookingId, String driverUsername);
    BookingResponse startTrip(Integer bookingId, String driverUsername);
    BookingResponse completeBooking(Integer bookingId, String driverUsername);
    BookingResponse updateDriverLocation(Integer bookingId, Double lat, Double lng);

    // ─── Queries ────────────────────────────────────────
    BookingResponse getBookingById(Integer bookingId);
    List<BookingResponse> getBookingsByCustomer(String customerUsername);
    List<BookingResponse> getBookingsByDriver(String driverUsername);
    List<BookingResponse> getBookingsByStatus(BookingStatus status);
    List<BookingResponse> getAllBookings();

    // ─── Admin actions ──────────────────────────────────
    BookingResponse updateBooking(Integer bookingId, BookingUpdateRequest request);
    void deleteBooking(Integer bookingId);   // <-- FIX for 500 error
}  