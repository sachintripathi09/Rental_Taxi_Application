package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.BookingRequest;
import com.rentaltaxi.dto.request.BookingUpdateRequest;
import com.rentaltaxi.dto.response.BookingResponse;
import com.rentaltaxi.entity.enums.BookingStatus;
import com.rentaltaxi.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "**")
public class BookingController {

    private final BookingService bookingService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // ─── Customer: Create a booking ────────────────────────────
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request, getCurrentUsername()));
    }

    // ─── Customer: Cancel own booking ──────────────────────────
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, getCurrentUsername()));
    }

    // ─── Driver: Accept a booking ──────────────────────────────
    @PutMapping("/{id}/accept")
    public ResponseEntity<BookingResponse> acceptBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id, getCurrentUsername()));
    }

    // ─── Driver: Reject a booking ──────────────────────────────
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, getCurrentUsername()));
    }

    // ─── Driver: Start trip ──────────────────────────────────────
    @PutMapping("/{id}/start")
    public ResponseEntity<BookingResponse> startTrip(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.startTrip(id, getCurrentUsername()));
    }

    // ─── Driver: Complete trip ──────────────────────────────────
    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.completeBooking(id, getCurrentUsername()));
    }

    // ─── Driver: Update live GPS location ──────────────────────
    @PutMapping("/{id}/location")
    public ResponseEntity<BookingResponse> updateDriverLocation(
            @PathVariable Integer id,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        return ResponseEntity.ok(bookingService.updateDriverLocation(id, lat, lng));
    }

    // ─── Public: Get a single booking ──────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // ─── Customer: Get own bookings ─────────────────────────────
    @GetMapping("/customer")
    public ResponseEntity<List<BookingResponse>> getBookingsByCustomer() {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(getCurrentUsername()));
    }

    // ─── Driver: Get own bookings ───────────────────────────────
    @GetMapping("/driver")
    public ResponseEntity<List<BookingResponse>> getBookingsByDriver() {
        return ResponseEntity.ok(bookingService.getBookingsByDriver(getCurrentUsername()));
    }

    // ─── Public: Get bookings by status ─────────────────────────
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    // ─── Admin: Get all bookings ────────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ─── Admin: Update a booking ────────────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Integer id,
            @Valid @RequestBody BookingUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    // ─── Admin: DELETE a booking (FIX for 500 error) ────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}