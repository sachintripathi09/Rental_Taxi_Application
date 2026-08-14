package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.FeedbackRequest;
import com.rentaltaxi.dto.request.FeedbackUpdateRequest;
import com.rentaltaxi.dto.response.FeedbackResponse;
import com.rentaltaxi.entity.Booking;
import com.rentaltaxi.entity.Feedback;
import com.rentaltaxi.repository.BookingRepository;
import com.rentaltaxi.repository.FeedbackRepository;
import com.rentaltaxi.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final BookingRepository bookingRepo;

    @Override
    @Transactional
    public FeedbackResponse createFeedback(Integer bookingId, FeedbackRequest request, String customerUsername) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Feedback feedback = Feedback.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .feedbackDate(LocalDateTime.now())
                .booking(booking)
                .build();
        return mapToResponse(feedbackRepo.save(feedback));
    }

    @Override
    public FeedbackResponse getFeedbackById(Integer feedbackId) {
        Feedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        return mapToResponse(feedback);
    }

    @Override
    public FeedbackResponse getFeedbackByBookingId(Integer bookingId) {
        Feedback feedback = feedbackRepo.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Feedback not found for this booking"));
        return mapToResponse(feedback);
    }

    @Override
    public List<FeedbackResponse> getAllFeedbacksByCustomer(String customerUsername) {
        return feedbackRepo.findAll().stream()
                .filter(f -> f.getBooking().getCustomer().getUsername().equals(customerUsername))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFeedback(Integer feedbackId) {
        feedbackRepo.deleteById(feedbackId);
    }

    @Override
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- NEW UPDATE METHOD ---
    @Override
    @Transactional
    public FeedbackResponse updateFeedback(Integer feedbackId, FeedbackUpdateRequest request) {
        Feedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        if (request.getRating() != null) feedback.setRating(request.getRating());
        if (request.getComment() != null) feedback.setComment(request.getComment());
        return mapToResponse(feedbackRepo.save(feedback));
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .feedbackId(feedback.getFeedbackId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .feedbackDate(feedback.getFeedbackDate())
                .bookingId(feedback.getBooking().getBookingId())
                .build();
    }
}