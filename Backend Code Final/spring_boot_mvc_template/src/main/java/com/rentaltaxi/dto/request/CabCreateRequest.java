package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CabCreateRequest {
    @NotBlank
    private String plateNumber;

    @NotBlank
    private String model;

    @NotNull @Positive
    private Integer capacity;

    private String status; // AVAILABLE, etc.

    private Integer driverId; // optional assignment
}
