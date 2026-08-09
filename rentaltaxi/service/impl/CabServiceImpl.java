package com.rentaltaxi.service.impl;

import com.rentaltaxi.dto.request.CabCreateRequest;
import com.rentaltaxi.dto.request.CabUpdateRequest;
import com.rentaltaxi.dto.response.CabResponse;
import com.rentaltaxi.entity.Admin;
import com.rentaltaxi.entity.Booking;
import com.rentaltaxi.entity.Cab;
import com.rentaltaxi.entity.Driver;
import com.rentaltaxi.entity.enums.BookingStatus;
import com.rentaltaxi.entity.enums.CabStatus;
import com.rentaltaxi.entity.enums.DriverStatus;
import com.rentaltaxi.repository.AdminRepository;
import com.rentaltaxi.repository.BookingRepository;
import com.rentaltaxi.repository.CabRepository;
import com.rentaltaxi.repository.DriverRepository;
import com.rentaltaxi.service.CabService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CabServiceImpl implements CabService {

    // ============================================================
    // ALL REPOSITORIES INJECTED (BookingRepository is CRITICAL)
    // ============================================================
    private final CabRepository cabRepo;
    private final AdminRepository adminRepo;
    private final DriverRepository driverRepo;
    private final BookingRepository bookingRepo; // <--- THIS MUST BE HERE

    // ============================================================
    // CREATE CAB
    // ============================================================
    @Override
    @Transactional
    public CabResponse createCab(CabCreateRequest request, String adminUsername) {
        Admin admin = adminRepo.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Cab cab = new Cab();
        cab.setPlateNumber(request.getPlateNumber());
        cab.setModel(request.getModel());
        cab.setCapacity(request.getCapacity());
        cab.setStatus(CabStatus.AVAILABLE);
        cab.setAdmin(admin);

        return mapToResponse(cabRepo.save(cab));
    }

    // ============================================================
    // UPDATE CAB
    // ============================================================
    @Override
    @Transactional
    public CabResponse updateCab(Integer cabId, CabUpdateRequest request) {
        Cab cab = cabRepo.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found"));

        if (request.getPlateNumber() != null) cab.setPlateNumber(request.getPlateNumber());
        if (request.getModel() != null) cab.setModel(request.getModel());
        if (request.getCapacity() != null) cab.setCapacity(request.getCapacity());
        if (request.getStatus() != null) cab.setStatus(CabStatus.valueOf(request.getStatus()));
        
        if (request.getDriverId() != null) {
            Driver driver = driverRepo.findById(request.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            cab.setDriver(driver);
        }

        return mapToResponse(cabRepo.save(cab));
    }

    // ============================================================
    // DELETE CAB
    // ============================================================
    @Override
    @Transactional
    public void deleteCab(Integer cabId) {
        cabRepo.deleteById(cabId);
    }

    // ============================================================
    // GET ALL CABS
    // ============================================================
    @Override
    public List<CabResponse> getAllCabs() {
        return cabRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET CAB BY ID
    // ============================================================
    @Override
    public CabResponse getCabById(Integer cabId) {
        Cab cab = cabRepo.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found"));
        return mapToResponse(cab);
    }

 // ============================================================
    // GET AVAILABLE CABS
    // ============================================================
    @Override
    public List<CabResponse> getAvailableCabs(LocalDateTime pickupTime) {
        // 1. Fetch all cabs with status AVAILABLE
        List<Cab> allAvailableCabs = cabRepo.findByStatus(CabStatus.AVAILABLE);

        // 2. Fetch all drivers who are busy (ACCEPTED or IN_PROGRESS)
        List<Booking> activeBookings = bookingRepo.findByStatusIn(
                List.of(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS)
        );

        // 3. Collect IDs of busy drivers
        Set<Integer> busyDriverIds = activeBookings.stream()
                .map(b -> b.getDriver().getDriverId())
                .collect(Collectors.toSet());

        // 4. Filter cabs: Only keep those whose driver is NOT busy
        List<Cab> availableCabs = allAvailableCabs.stream()
                .filter(cab -> {
                    if (cab.getDriver() == null) return true;
                    return !busyDriverIds.contains(cab.getDriver().getDriverId());
                })
                .collect(Collectors.toList());

        // 5. Map to Response DTO
        return availableCabs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET AVAILABLE CABS (BACKWARD COMPATIBILITY - OLD ONE)
    // ============================================================
    @Override
    public List<CabResponse> getAvailableCabs() {
        return cabRepo.findByStatus(CabStatus.AVAILABLE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // ASSIGN DRIVER TO CAB
    // ============================================================
    @Override
    @Transactional
    public CabResponse assignDriver(Integer cabId, Integer driverId) {
        Cab cab = cabRepo.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found"));
        Driver driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        cab.setDriver(driver);
        cab.setStatus(CabStatus.BOOKED);
        driver.setStatus(DriverStatus.ON_TRIP);
        driverRepo.save(driver);

        return mapToResponse(cabRepo.save(cab));
    }

    // ============================================================
    // UNASSIGN DRIVER FROM CAB
    // ============================================================
    @Override
    @Transactional
    public CabResponse unassignDriver(Integer cabId) {
        Cab cab = cabRepo.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found"));

        if (cab.getDriver() != null) {
            Driver driver = cab.getDriver();
            driver.setStatus(DriverStatus.AVAILABLE);
            driver.setCab(null);
            driverRepo.save(driver);
            cab.setDriver(null);
            cab.setStatus(CabStatus.AVAILABLE);
        }

        return mapToResponse(cabRepo.save(cab));
    }

    // ============================================================
    // PRIVATE MAPPER
    // ============================================================
    private CabResponse mapToResponse(Cab cab) {
        return CabResponse.builder()
                .cabId(cab.getCabId())
                .plateNumber(cab.getPlateNumber())
                .model(cab.getModel())
                .capacity(cab.getCapacity())
                .status(cab.getStatus())
                .driverId(cab.getDriver() != null ? cab.getDriver().getDriverId() : null)
                .createdAt(cab.getCreatedAt())
                .updatedAt(cab.getUpdatedAt())
                .build();
    }
}