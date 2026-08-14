package com.rentaltaxi.repository;

import com.rentaltaxi.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Optional<Feedback> findByBooking_BookingId(Integer bookingId);
    List<Feedback> findByBooking_Customer_CustomerId(Integer customerId);
    List<Feedback> findByBooking_Driver_DriverId(Integer driverId);
}    
