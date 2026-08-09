package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.PaymentRequest;
import com.rentaltaxi.dto.request.PaymentUpdateRequest;
import com.rentaltaxi.dto.response.PaymentResponse;
import com.rentaltaxi.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> createPayment(@PathVariable Integer bookingId, @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(bookingId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBookingId(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.refundPayment(id));
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(@PathVariable Integer id, @Valid @RequestBody PaymentUpdateRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }
}
