package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.FeedbackRequest;
import com.rentaltaxi.dto.request.FeedbackUpdateRequest;
import com.rentaltaxi.dto.response.FeedbackResponse;
import com.rentaltaxi.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {
    private final FeedbackService feedbackService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<FeedbackResponse> createFeedback(@PathVariable Integer bookingId, @Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.createFeedback(bookingId, request, getCurrentUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Integer id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<FeedbackResponse> getFeedbackByBookingId(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByBookingId(bookingId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacksByCustomer() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacksByCustomer(getCurrentUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Integer id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponse> updateFeedback(@PathVariable Integer id, @Valid @RequestBody FeedbackUpdateRequest request) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, request));
    }
}
