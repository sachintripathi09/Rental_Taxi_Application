package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.FeedbackRequest;
import com.rentaltaxi.dto.request.FeedbackUpdateRequest;
import com.rentaltaxi.dto.response.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    FeedbackResponse createFeedback(Integer bookingId, FeedbackRequest request, String customerUsername);
    FeedbackResponse getFeedbackById(Integer feedbackId);
    FeedbackResponse getFeedbackByBookingId(Integer bookingId);
    List<FeedbackResponse> getAllFeedbacksByCustomer(String customerUsername);
    void deleteFeedback(Integer feedbackId);
    List<FeedbackResponse> getAllFeedbacks();
    FeedbackResponse updateFeedback(Integer feedbackId, FeedbackUpdateRequest request);
}