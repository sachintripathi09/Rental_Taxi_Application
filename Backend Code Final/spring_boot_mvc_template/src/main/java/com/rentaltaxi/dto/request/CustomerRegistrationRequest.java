package com.rentaltaxi.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CustomerRegistrationRequest {
    @NotBlank @Size(min = 3, max = 50)
    private String username;
    @NotBlank @Size(min = 6, max = 100)
    private String password;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String fullName;
    private String phone;
    private String address;
}
