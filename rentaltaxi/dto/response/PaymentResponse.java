package com.rentaltaxi.dto.response;

import com.rentaltaxi.entity.enums.PaymentMethod;
import com.rentaltaxi.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Integer paymentId;
    private Double amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
    private Integer bookingId;
}