package com.rentaltaxi.dto.response;

import com.rentaltaxi.entity.enums.AdminStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminRegistrationResponse {
    private Integer adminId;
    private String username;
    private String email;
    private String fullName;
    private String message;
    private AdminStatus status;
}