package com.rentaltaxi.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverRegistrationResponse {
    private Integer driverId;
    private String username;
    private String email;
    private String fullName;
    private String status;
    private String message;
}
