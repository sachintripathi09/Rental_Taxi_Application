package com.rentaltaxi.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CabUpdateRequest {
	private String plateNumber;
    private String model;
    @Positive
    private Integer capacity;
    private String status;
    private Integer driverId; 
}
