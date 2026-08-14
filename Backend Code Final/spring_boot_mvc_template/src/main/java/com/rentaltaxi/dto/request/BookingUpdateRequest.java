package com.rentaltaxi.dto.request;

import com.rentaltaxi.entity.enums.BookingStatus;
import lombok.Data;

@Data
public class BookingUpdateRequest {
    private BookingStatus status;
    private Double fare;
}