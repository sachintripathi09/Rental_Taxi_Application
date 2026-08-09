package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.LocationUpdateRequest;
import com.rentaltaxi.dto.response.LocationUpdateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class LocationController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/driver-location/{driverId}")
    public void updateDriverLocation(@DestinationVariable Integer driverId, LocationUpdateRequest request) {
        // Map the Request DTO to a Response DTO to send to the client
        LocationUpdateResponse response = new LocationUpdateResponse();
        response.setDriverId(driverId);
        response.setLat(request.getLat());
        response.setLng(request.getLng());

        // Broadcast the response object to all customers subscribed to this specific driver's channel
        messagingTemplate.convertAndSend("/topic/location/" + driverId, response);
    }
}
