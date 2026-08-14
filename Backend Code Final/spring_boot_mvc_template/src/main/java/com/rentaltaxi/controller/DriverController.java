package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.DriverUpdateRequest;
import com.rentaltaxi.dto.response.DriverResponse;
import com.rentaltaxi.entity.enums.DriverStatus;
import com.rentaltaxi.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
@CrossOrigin(origins = "**")
public class DriverController {

    private final DriverService driverService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // --- Self-service endpoints ---
    @GetMapping("/me")
    public ResponseEntity<DriverResponse> getCurrentDriver() {
        return ResponseEntity.ok(driverService.getCurrentDriver(getCurrentUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<DriverResponse> updateCurrentDriver(@Valid @RequestBody DriverUpdateRequest request) {
        return ResponseEntity.ok(driverService.updateDriver(getCurrentUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverResponse> getDriverById(@PathVariable Integer id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DriverResponse> updateDriverStatus(@PathVariable Integer id, @RequestParam DriverStatus status) {
        return ResponseEntity.ok(driverService.updateDriverStatus(id, status));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DriverResponse> updateDriver(@PathVariable Integer id, @Valid @RequestBody DriverUpdateRequest request) {
        return ResponseEntity.ok(driverService.updateDriver(id, request));
    }

    // --- NEW ENDPOINT ADDED FOR DELETING DRIVER ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDriver(@PathVariable Integer id) {
        driverService.deleteDriver(id);
        return ResponseEntity.ok().build();
    }

    // --- Earnings and rating endpoints ---
    @GetMapping("/me/earnings")
    public ResponseEntity<Double> getCurrentDriverEarnings() {
        return ResponseEntity.ok(driverService.getDriverEarnings(getCurrentUsername()));
    }

    @GetMapping("/me/rating")
    public ResponseEntity<Double> getCurrentDriverRating() {
        return ResponseEntity.ok(driverService.getDriverAverageRating(getCurrentUsername()));
    }
}