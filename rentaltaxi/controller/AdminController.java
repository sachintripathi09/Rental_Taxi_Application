package com.rentaltaxi.controller;

import com.rentaltaxi.dto.request.AdminUpdateRequest;
import com.rentaltaxi.dto.response.AdminResponse;
import com.rentaltaxi.entity.enums.AdminStatus;
import com.rentaltaxi.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
@CrossOrigin(origins = "**")
public class AdminController {

    private final AdminService adminService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * Get the profile of the currently logged-in admin.
     * GET /admins/me
     */
    @GetMapping("/me")
    public ResponseEntity<AdminResponse> getCurrentAdmin() {
        return ResponseEntity.ok(adminService.getCurrentAdmin(getCurrentUsername()));
    }

    /**
     * Update the profile of the currently logged-in admin.
     * PUT /admins/me
     */
    @PutMapping("/me")
    public ResponseEntity<AdminResponse> updateCurrentAdmin(
            @Valid @RequestBody AdminUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(getCurrentUsername(), request));
    }

    /**
     * Get a specific admin by ID.
     * GET /admins/{id}
     * 
     * FIXED: Previously was @GetMapping("/id") which didn't read the path variable.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    /**
     * Get all admins in the system.
     * GET /admins
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminResponse>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    /**
     * Delete an admin by ID.
     * DELETE /admins/{id}
     * 
     * FIXED: Previously was @DeleteMapping("/id") which didn't read the path variable.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Integer id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Fully update an admin by ID (Full Name, Phone, Email, Status).
     * PUT /admins/{id}
     * 
     * FIXED: Previously was @PutMapping("/id") which didn't read the path variable.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> updateAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody AdminUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(id, request));
    }
    

    /**
     * Update ONLY the status of an admin (ACTIVE or INACTIVE).
     * PUT /admins/{id}/status?status=ACTIVE
     * 
     * This allows an admin to deactivate/reactivate other admin accounts.
     * Deactivated admins will be blocked during login via CustomUserDetailsService.
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> updateAdminStatus(
            @PathVariable Integer id,
            @RequestParam(name = "status") AdminStatus status) {
        return ResponseEntity.ok(adminService.updateAdminStatus(id, status));
    }
}