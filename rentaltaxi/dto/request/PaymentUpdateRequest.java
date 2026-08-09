package com.rentaltaxi.dto.request;

import com.rentaltaxi.entity.enums.PaymentStatus;
import lombok.Data;

@Data
public class PaymentUpdateRequest {
    private Double amount;
    private PaymentStatus status;
}
