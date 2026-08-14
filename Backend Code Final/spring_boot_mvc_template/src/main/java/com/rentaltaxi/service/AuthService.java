package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.*;
import com.rentaltaxi.dto.response.AuthResponse;
import com.rentaltaxi.dto.response.ApiResponse;

public interface AuthService {
    ApiResponse registerCustomer(CustomerRegistrationRequest request);
    ApiResponse registerDriver(DriverRegistrationRequest request);
    ApiResponse registerAdmin(AdminRegistrationRequest request);
    AuthResponse login(LoginRequest request);
}
