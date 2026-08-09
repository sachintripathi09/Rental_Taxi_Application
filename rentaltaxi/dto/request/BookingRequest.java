package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotBlank
    private String pickupLocation;

    @NotBlank
    private String dropoffLocation;

    @NotNull
    private LocalDateTime pickupTime;
}
