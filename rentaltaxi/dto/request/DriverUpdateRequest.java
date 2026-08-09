package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class DriverUpdateRequest {
    private String fullName;
    private String phone;
    private String licenseNumber;
    private String status;
    @Email
    private String email;
}
