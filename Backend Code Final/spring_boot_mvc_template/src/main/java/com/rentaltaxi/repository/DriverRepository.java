package com.rentaltaxi.repository;

import com.rentaltaxi.entity.Driver;
import com.rentaltaxi.entity.enums.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
    Optional<Driver> findByUsername(String username);
    Optional<Driver> findByEmail(String email);
    List<Driver> findByStatus(DriverStatus status);
}
