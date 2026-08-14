package com.rentaltaxi.repository;

import com.rentaltaxi.entity.Cab;
import com.rentaltaxi.entity.enums.CabStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabRepository extends JpaRepository<Cab, Integer> {
    List<Cab> findByStatus(CabStatus status);
}
