package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerUpdateRequest {
    private String fullName;
    private String phone;
    private String address;
    @Email
    private String email;
}
