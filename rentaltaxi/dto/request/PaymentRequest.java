package com.rentaltaxi.dto.request;

import com.rentaltaxi.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull @Positive
    private Double amount;

    @NotNull
    private PaymentMethod method;
}
