package com.rentaltaxi.dto.request;

import com.rentaltaxi.entity.enums.AdminStatus;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class AdminUpdateRequest {
    private String fullName;
    private String phone;
    @Email
    private String email;
    private AdminStatus status;
}
