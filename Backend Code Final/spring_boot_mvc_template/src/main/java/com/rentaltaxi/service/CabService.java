package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.CabCreateRequest;
import com.rentaltaxi.dto.request.CabUpdateRequest;
import com.rentaltaxi.dto.response.CabResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface CabService {

    CabResponse createCab(CabCreateRequest request, String adminUsername);
    
    CabResponse updateCab(Integer cabId, CabUpdateRequest request);
    
    void deleteCab(Integer cabId);
    
    List<CabResponse> getAllCabs();
    
    CabResponse getCabById(Integer cabId);
    
    List<CabResponse> getAvailableCabs();
    
    List<CabResponse> getAvailableCabs(LocalDateTime pickupTime);
    
    CabResponse assignDriver(Integer cabId, Integer driverId);
    
    CabResponse unassignDriver(Integer cabId);
}