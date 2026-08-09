package com.rentaltaxi.dto.request;

import lombok.Data;

@Data
public class LocationUpdateRequest {
    private Integer driverId;
    private double lat;
    private double lng;
}
