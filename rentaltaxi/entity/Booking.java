package com.rentaltaxi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rentaltaxi.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @Column(nullable = false, length = 255)
    private String pickupLocation;

    @Column(nullable = false, length = 255)
    private String dropoffLocation;

    @Column(nullable = false)
    private LocalDateTime pickupTime;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private BookingStatus status;

    private Double fare;
    private Double distance;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Column(nullable = true)
    private Double driverLat;

    @Column(nullable = true)
    private Double driverLng;

    @Column(nullable = true)
    private Double pickupLat;

    @Column(nullable = true)
    private Double pickupLng;

    @Column(nullable = true)
    private Double dropoffLat;

    @Column(nullable = true)
    private Double dropoffLng;

    @Column(nullable = true)
    private String driverName;

    @Column(nullable = true)
    private String driverPhone;

    @Column(nullable = true)
    private String driverLicense;

    @Column(nullable = true)
    private String customerName;

    @Column(nullable = true)
    private String customerPhone;

    @Column(nullable = true)
    private String customerAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bookings", "cab", "admin"}) 
    private Driver driver;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Payment payment;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Feedback feedback;
}