package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.response.BookingResponse;
import com.rentaltaxi.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationServiceImpl implements WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyBookingAccepted(BookingResponse bookingResponse) {
        messagingTemplate.convertAndSend("/topic/booking", bookingResponse);
        System.out.println(">>> WebSocket Update Sent (ACCEPTED): " + bookingResponse.getBookingId());
    }

    @Override
    public void notifyBookingRejected(BookingResponse bookingResponse) {
        messagingTemplate.convertAndSend("/topic/booking", bookingResponse);
        System.out.println(">>> WebSocket Update Sent (REJECTED): " + bookingResponse.getBookingId());
    }
    
    @Override
    public void notifyBookingCompleted(BookingResponse bookingResponse) {
        messagingTemplate.convertAndSend("/topic/booking", bookingResponse);
        System.out.println(">>> WebSocket Update Sent (COMPLETED): " + bookingResponse.getBookingId());
    }
    
    @Override
    public void notifyTripStarted(BookingResponse bookingResponse) {
        messagingTemplate.convertAndSend("/topic/booking", bookingResponse);
        System.out.println(">>> WebSocket Update Sent (TRIP_STARTED): " + bookingResponse.getBookingId());
    }

    @Override
    public void notifyDriverLocationUpdate(BookingResponse bookingResponse) {
        messagingTemplate.convertAndSend("/topic/location/update", bookingResponse);
    }
    
    @Override
    public void notifyDriverDetails(BookingResponse response) {
        messagingTemplate.convertAndSend("/topic/driver/details", response);
    }

    @Override
    public void notifyCustomerDetails(BookingResponse response) {
        messagingTemplate.convertAndSend("/topic/customer/details", response);
    }
}