package com.rentaltaxi.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_settings")
@EntityListeners(AuditingEntityListener.class)
public class SystemSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double baseFare;

    @Column(nullable = false)
    private Double perKmRate;

    @Column(nullable = false)
    private Double platformCommission;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Default Constructor (Required for JPA)
    public SystemSettings() {}

    // All-Args Constructor (Required for creating objects)
    public SystemSettings(Long id, Double baseFare, Double perKmRate, Double platformCommission, LocalDateTime updatedAt) {
        this.id = id;
        this.baseFare = baseFare;
        this.perKmRate = perKmRate;
        this.platformCommission = platformCommission;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getBaseFare() { return baseFare; }
    public void setBaseFare(Double baseFare) { this.baseFare = baseFare; }

    public Double getPerKmRate() { return perKmRate; }
    public void setPerKmRate(Double perKmRate) { this.perKmRate = perKmRate; }

    public Double getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(Double platformCommission) { this.platformCommission = platformCommission; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}