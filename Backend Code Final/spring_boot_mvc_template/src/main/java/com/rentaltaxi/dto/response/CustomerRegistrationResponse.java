package com.rentaltaxi.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerRegistrationResponse {
    private Integer customerId;
    private String username;
    private String email;
    private String fullName;
    private String message;
}