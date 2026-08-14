package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.CabCreateRequest;
import com.rentaltaxi.dto.request.CabUpdateRequest;
import com.rentaltaxi.dto.response.CabResponse;
import com.rentaltaxi.service.CabService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/cabs")
@RequiredArgsConstructor
public class CabController {

    private final CabService cabService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    public ResponseEntity<CabResponse> createCab(@Valid @RequestBody CabCreateRequest request) {
        return ResponseEntity.ok(cabService.createCab(request, getCurrentUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CabResponse> updateCab(@PathVariable Integer id, @Valid @RequestBody CabUpdateRequest request) {
        return ResponseEntity.ok(cabService.updateCab(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCab(@PathVariable Integer id) {
        cabService.deleteCab(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CabResponse>> getAllCabs() {
        return ResponseEntity.ok(cabService.getAllCabs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CabResponse> getCabById(@PathVariable Integer id) {
        return ResponseEntity.ok(cabService.getCabById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<CabResponse>> getAvailableCabs(
            @RequestParam(required = false) String pickupTime) {

        if (pickupTime != null && !pickupTime.isEmpty()) {
            // Parse ISO-8601 with timezone (e.g., "2026-08-09T15:30:00.000Z")
            LocalDateTime time = LocalDateTime.parse(pickupTime, DateTimeFormatter.ISO_DATE_TIME);
            return ResponseEntity.ok(cabService.getAvailableCabs(time));
        }
        // Fallback: no time provided -> return all available cabs
        return ResponseEntity.ok(cabService.getAvailableCabs());
    }

    @PutMapping("/{cabId}/assign/{driverId}")
    public ResponseEntity<CabResponse> assignDriver(@PathVariable Integer cabId, @PathVariable Integer driverId) {
        return ResponseEntity.ok(cabService.assignDriver(cabId, driverId));
    }

    @PutMapping("/{cabId}/unassign")
    public ResponseEntity<CabResponse> unassignDriver(@PathVariable Integer cabId) {
        return ResponseEntity.ok(cabService.unassignDriver(cabId));
    }
}
