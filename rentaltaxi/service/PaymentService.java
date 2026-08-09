package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.PaymentRequest;
import com.rentaltaxi.dto.request.PaymentUpdateRequest;
import com.rentaltaxi.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {
    PaymentResponse createPayment(Integer bookingId, PaymentRequest request);
    PaymentResponse getPaymentById(Integer paymentId);
    PaymentResponse getPaymentByBookingId(Integer bookingId);
    PaymentResponse refundPayment(Integer paymentId);
    List<PaymentResponse> getAllPayments();
    PaymentResponse updatePayment(Integer paymentId, PaymentUpdateRequest request);
}
