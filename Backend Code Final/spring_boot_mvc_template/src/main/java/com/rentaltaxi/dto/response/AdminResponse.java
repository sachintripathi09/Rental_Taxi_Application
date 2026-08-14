package com.rentaltaxi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.rentaltaxi.entity.enums.AdminStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {
    private Integer adminId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private AdminStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
