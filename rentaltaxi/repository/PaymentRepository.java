package com.rentaltaxi.repository;

import com.rentaltaxi.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBooking_BookingId(Integer bookingId);
}
