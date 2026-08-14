package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.DriverUpdateRequest;
import com.rentaltaxi.dto.response.DriverResponse;
import com.rentaltaxi.entity.enums.DriverStatus;

import java.util.List;

public interface DriverService {
    DriverResponse getCurrentDriver(String username);
    DriverResponse updateDriver(String username, DriverUpdateRequest request);
    DriverResponse getDriverById(Integer driverId);
    DriverResponse updateDriverStatus(Integer driverId, DriverStatus status);
    List<DriverResponse> getAllDrivers();
    DriverResponse updateDriver(Integer driverId, DriverUpdateRequest request);
    Double getDriverEarnings(String username);
    Double getDriverAverageRating(String username);
    void deleteDriver(Integer id);
}