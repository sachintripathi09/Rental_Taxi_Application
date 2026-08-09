package com.rentaltaxi.repository;

import com.rentaltaxi.entity.Booking;
import com.rentaltaxi.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByCustomer_CustomerId(Integer customerId);
    
    List<Booking> findByDriver_DriverId(Integer driverId);
    
    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStatusIn(List<BookingStatus> statuses);

    List<Booking> findByDriver_DriverIdAndStatus(Integer driverId, BookingStatus status);
}