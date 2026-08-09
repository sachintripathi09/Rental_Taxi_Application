package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SettingsUpdateRequest {
    @NotNull @Positive
    private Double baseFare;

    @NotNull @Positive
    private Double perKmRate;

    @NotNull @Positive
    private Double platformCommission;
}