package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.PaymentRequest;
import com.rentaltaxi.dto.request.PaymentUpdateRequest;
import com.rentaltaxi.dto.response.PaymentResponse;
import com.rentaltaxi.entity.Booking;
import com.rentaltaxi.entity.Payment;
import com.rentaltaxi.entity.enums.PaymentStatus;
import com.rentaltaxi.repository.BookingRepository;
import com.rentaltaxi.repository.PaymentRepository;
import com.rentaltaxi.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepo;
    private final BookingRepository bookingRepo;

    @Override
    @Transactional
    public PaymentResponse createPayment(Integer bookingId, PaymentRequest request) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.COMPLETED)
                .paymentDate(LocalDateTime.now())
                .booking(booking)
                .build();
        return mapToResponse(paymentRepo.save(payment));
    }

    @Override
    public PaymentResponse getPaymentById(Integer paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByBookingId(Integer bookingId) {
        Payment payment = paymentRepo.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for this booking"));
        return mapToResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(Integer paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.FAILED);
        return mapToResponse(paymentRepo.save(payment));
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
 
    @Override
    @Transactional
    public PaymentResponse updatePayment(Integer paymentId, PaymentUpdateRequest request) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        if (request.getAmount() != null) payment.setAmount(request.getAmount());
        if (request.getStatus() != null) payment.setStatus(request.getStatus());
        return mapToResponse(paymentRepo.save(payment));
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .bookingId(payment.getBooking().getBookingId())
                .build();
    }
}