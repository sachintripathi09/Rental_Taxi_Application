package com.rentaltaxi.service;

import com.rentaltaxi.dto.request.SettingsUpdateRequest;
import com.rentaltaxi.dto.response.SettingsResponse;

public interface SettingsService {
    SettingsResponse getSettings();
    SettingsResponse updateSettings(SettingsUpdateRequest request);
}