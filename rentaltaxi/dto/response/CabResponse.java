package com.rentaltaxi.dto.response;

import com.rentaltaxi.entity.enums.CabStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CabResponse {
    private Integer cabId;
    private String plateNumber;
    private String model;
    private Integer capacity;
    private CabStatus status;
    private Integer driverId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}