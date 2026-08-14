package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.SettingsUpdateRequest;
import com.rentaltaxi.dto.response.SettingsResponse;
import com.rentaltaxi.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*") // Added CORS to eliminate any port mismatch
@RequiredArgsConstructor
public class SettingsController {
    
    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    
    public ResponseEntity<SettingsResponse> updateSettings(@Valid @RequestBody SettingsUpdateRequest request) {
        return ResponseEntity.ok(settingsService.updateSettings(request));
    }
}