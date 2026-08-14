package com.rentaltaxi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsResponse {
    private Long id;
    private Double baseFare;
    private Double perKmRate;
    private Double platformCommission;
    private LocalDateTime updatedAt;
}