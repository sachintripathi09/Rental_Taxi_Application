package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.AdminRegistrationRequest;
import com.rentaltaxi.dto.request.CustomerRegistrationRequest;
import com.rentaltaxi.dto.request.DriverRegistrationRequest;
import com.rentaltaxi.dto.request.LoginRequest;
import com.rentaltaxi.dto.response.ApiResponse;
import com.rentaltaxi.dto.response.AuthResponse;
import com.rentaltaxi.entity.Admin;
import com.rentaltaxi.entity.Customer;
import com.rentaltaxi.entity.Driver;
import com.rentaltaxi.entity.enums.DriverStatus;
import com.rentaltaxi.repository.AdminRepository;
import com.rentaltaxi.repository.CustomerRepository;
import com.rentaltaxi.repository.DriverRepository;
import com.rentaltaxi.security.JwtUtil;
import com.rentaltaxi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AdminRepository adminRepo;
    private final CustomerRepository customerRepo;
    private final DriverRepository driverRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public ApiResponse registerCustomer(CustomerRegistrationRequest req) {
        if (customerRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Using manual setters instead of Lombok builder to avoid cache errors
        Customer customer = new Customer();
        customer.setUsername(req.getUsername());
        customer.setPassword(passwordEncoder.encode(req.getPassword()));
        customer.setEmail(req.getEmail());
        customer.setFullName(req.getFullName());
        customer.setPhone(req.getPhone());
        customer.setAddress(req.getAddress());

        customerRepo.save(customer);
        return new ApiResponse(true, "Customer registered successfully");
    }

    @Override
    public ApiResponse registerDriver(DriverRegistrationRequest req) {
        if (driverRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Using manual setters - this handles DriverStatus.AVAILABLE correctly every time
        Driver driver = new Driver();
        driver.setUsername(req.getUsername());
        driver.setPassword(passwordEncoder.encode(req.getPassword()));
        driver.setEmail(req.getEmail());
        driver.setFullName(req.getFullName());
        driver.setPhone(req.getPhone());
        driver.setLicenseNumber(req.getLicenseNumber());
        driver.setStatus(DriverStatus.AVAILABLE);

        driverRepo.save(driver);
        return new ApiResponse(true, "Driver registered successfully");
    }

    @Override
    public ApiResponse registerAdmin(AdminRegistrationRequest req) {
        if (adminRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Using manual setters
        Admin admin = new Admin();
        admin.setUsername(req.getUsername());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setEmail(req.getEmail());
        admin.setFullName(req.getFullName());
        admin.setPhone(req.getPhone());

        adminRepo.save(admin);
        return new ApiResponse(true, "Admin registered successfully");
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        String token = jwtUtil.generateToken(req.getUsername());
        
        // Determine the user's actual role by checking the databases
        String role = "USER"; // Default fallback
        
        if (adminRepo.findByUsername(req.getUsername()).isPresent()) {
            role = "ADMIN";
        } else if (customerRepo.findByUsername(req.getUsername()).isPresent()) {
            role = "CUSTOMER";
        } else if (driverRepo.findByUsername(req.getUsername()).isPresent()) {
            role = "DRIVER";
        }

        return AuthResponse.builder()
                .token(token)
                .username(req.getUsername())
                .role(role) // Now returns the real role instead of hardcoded "USER"
                .build();
    }
}