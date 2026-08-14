package com.rentaltaxi.service;

import com.rentaltaxi.dto.response.BookingResponse; 

public interface WebSocketNotificationService {
    void notifyBookingAccepted(BookingResponse bookingResponse); 
    void notifyBookingRejected(BookingResponse bookingResponse);
    void notifyBookingCompleted(BookingResponse bookingResponse);
    void notifyTripStarted(BookingResponse bookingResponse);
    void notifyDriverLocationUpdate(BookingResponse bookingResponse);
    void notifyDriverDetails(BookingResponse response); 
    void notifyCustomerDetails(BookingResponse response); 
}    
