package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.*;
import com.rentaltaxi.dto.response.ApiResponse;
import com.rentaltaxi.dto.response.AuthResponse;
import com.rentaltaxi.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // Allows ANY local port during development
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest req) {
        return ResponseEntity.ok(authService.registerCustomer(req));
    }

    @PostMapping("/register/driver")
    public ResponseEntity<ApiResponse> registerDriver(@Valid @RequestBody DriverRegistrationRequest req) {
        return ResponseEntity.ok(authService.registerDriver(req));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse> registerAdmin(@Valid @RequestBody AdminRegistrationRequest req) {
        return ResponseEntity.ok(authService.registerAdmin(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
