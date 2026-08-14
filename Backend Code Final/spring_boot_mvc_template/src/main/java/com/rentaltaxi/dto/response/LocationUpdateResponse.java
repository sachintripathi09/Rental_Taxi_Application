package com.rentaltaxi.dto.response;

import lombok.Data;

@Data
public class LocationUpdateResponse {
    private Integer driverId;
    private double lat;
    private double lng;
}