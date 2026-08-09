package com.rentaltaxi.dto.response;

import com.rentaltaxi.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Integer bookingId;
    private String pickupLocation;
    private String dropoffLocation;
    private LocalDateTime pickupTime;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private Double fare;
    private Double distance;
    private Integer customerId;
    private Integer driverId;
    private Integer paymentId;
    private Integer feedbackId;
}