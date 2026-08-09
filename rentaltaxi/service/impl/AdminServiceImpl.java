package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.AdminUpdateRequest;
import com.rentaltaxi.dto.response.AdminResponse;
import com.rentaltaxi.entity.Admin;
import com.rentaltaxi.entity.enums.AdminStatus;
import com.rentaltaxi.repository.AdminRepository;
import com.rentaltaxi.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepo;

    @Override
    public AdminResponse getCurrentAdmin(String username) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));
        return mapToResponse(admin);
    }

    @Override
    @Transactional
    public AdminResponse updateAdmin(String username, AdminUpdateRequest request) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));

        if (request.getFullName() != null) {
            admin.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            admin.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            admin.setEmail(request.getEmail());
        }
        // --- NEW: Handle Status Update ---
        if (request.getStatus() != null) {
            admin.setStatus(request.getStatus());
        }

        return mapToResponse(adminRepo.save(admin));
    }

    @Override
    public AdminResponse getAdminById(Integer adminId) {
        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + adminId));
        return mapToResponse(admin);
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        List<Admin> admins = adminRepo.findAll();
        List<AdminResponse> responses = new ArrayList<>();
        for (Admin admin : admins) {
            responses.add(mapToResponse(admin));
        }
        return responses;
    }

    @Override
    @Transactional
    public void deleteAdmin(Integer adminId) {
        if (!adminRepo.existsById(adminId)) {
            throw new RuntimeException("Admin not found with ID: " + adminId);
        }
        adminRepo.deleteById(adminId);
    }

    @Override
    @Transactional
    public AdminResponse updateAdmin(Integer adminId, AdminUpdateRequest request) {
        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + adminId));

        if (request.getFullName() != null) {
            admin.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            admin.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            admin.setEmail(request.getEmail());
        }
        // --- NEW: Handle Status Update ---
        if (request.getStatus() != null) {
            admin.setStatus(request.getStatus());
        }

        return mapToResponse(adminRepo.save(admin));
    }

    // ============================================================
    // NEW METHOD: Update ONLY the status of an admin (used by /{id}/status endpoint)
    // ============================================================
    @Override
    @Transactional
    public AdminResponse updateAdminStatus(Integer adminId, AdminStatus status) {
        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + adminId));

        admin.setStatus(status);
        return mapToResponse(adminRepo.save(admin));
    }

    // ============================================================
    // PRIVATE MAPPER: Converts Entity -> Response DTO
    // ============================================================
    private AdminResponse mapToResponse(Admin admin) {
        AdminResponse response = new AdminResponse();
        response.setAdminId(admin.getAdminId());
        response.setUsername(admin.getUsername());
        response.setEmail(admin.getEmail());
        response.setFullName(admin.getFullName());
        response.setPhone(admin.getPhone());
        response.setCreatedAt(admin.getCreatedAt());
        response.setUpdatedAt(admin.getUpdatedAt());

        // --- CRITICAL: Map the Status field to the Response DTO ---
        // If status is null (old data), default to ACTIVE to avoid breaking existing records.
        if (admin.getStatus() != null) {
            response.setStatus(admin.getStatus());
        } else {
            response.setStatus(AdminStatus.ACTIVE);
        }

        return response;
    }
}