package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.SettingsUpdateRequest;
import com.rentaltaxi.dto.response.SettingsResponse;
import com.rentaltaxi.entity.SystemSettings;
import com.rentaltaxi.repository.SystemSettingsRepository;
import com.rentaltaxi.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {
    
    private final SystemSettingsRepository settingsRepo;

    @Override
    public SettingsResponse getSettings() {
        SystemSettings settings = settingsRepo.findById(1L).orElseGet(() -> {
            SystemSettings defaultSettings = new SystemSettings(
                null, 50.0, 12.0, 10.0, null
            );
            return settingsRepo.save(defaultSettings);
        });
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public SettingsResponse updateSettings(SettingsUpdateRequest request) {
        SystemSettings settings = settingsRepo.findById(1L)
                .orElseThrow(() -> new RuntimeException("Settings not found. Please ensure the database is seeded."));

        settings.setBaseFare(request.getBaseFare());
        settings.setPerKmRate(request.getPerKmRate());
        settings.setPlatformCommission(request.getPlatformCommission());

        return mapToResponse(settingsRepo.save(settings));
    }

    private SettingsResponse mapToResponse(SystemSettings settings) {
        
        return SettingsResponse.builder()
                .id(settings.getId())
                .baseFare(settings.getBaseFare())
                .perKmRate(settings.getPerKmRate())
                .platformCommission(settings.getPlatformCommission())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}