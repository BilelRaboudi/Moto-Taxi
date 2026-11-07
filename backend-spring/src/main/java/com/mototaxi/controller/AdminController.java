package com.mototaxi.controller;

import com.mototaxi.dto.PagedResponse;
import com.mototaxi.dto.RideResponse;
import com.mototaxi.dto.TariffRequest;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Ride;
import com.mototaxi.model.Tariff;
import com.mototaxi.model.User;
import com.mototaxi.repository.DriverRepository;
import com.mototaxi.repository.RideRepository;
import com.mototaxi.service.DriverService;
import com.mototaxi.service.RideService;
import com.mototaxi.service.TariffService;
import com.mototaxi.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final DriverService driverService;
    private final UserService userService;
    private final RideService rideService;
    private final TariffService tariffService;
    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;

    @GetMapping("/drivers/pending")
    public ResponseEntity<List<Driver>> getPendingDrivers() {
        return ResponseEntity.ok(driverService.getPendingDrivers());
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @PutMapping("/drivers/{id}/validate")
    public ResponseEntity<Driver> validateDriver(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.validateDriver(id));
    }

    @PutMapping("/drivers/{id}/refuse")
    public ResponseEntity<Driver> refuseDriver(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.refuseDriver(id));
    }

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(userService.getAllUsers(PageRequest.of(page, size)));
    }

    @GetMapping("/rides")
    public ResponseEntity<PagedResponse<RideResponse>> getAllRides(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(rideService.getAllRides(PageRequest.of(page, size)));
    }

    @PutMapping("/tariffs/{vehicleType}")
    public ResponseEntity<Tariff> updateTariff(@PathVariable Driver.VehicleType vehicleType,
                                               @Valid @RequestBody TariffRequest request) {
        return ResponseEntity.ok(tariffService.updateTariff(vehicleType, request));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        long activeRides = rideRepository.countByStatusIn(List.of(
                Ride.RideStatus.PENDING,
                Ride.RideStatus.ACCEPTED,
                Ride.RideStatus.IN_PROGRESS
        ));

        long onlineDrivers = driverRepository.countByIsAvailableTrueAndStatus(Driver.DriverStatus.VALIDATED);
        long pendingDrivers = driverRepository.countByStatus(Driver.DriverStatus.PENDING);
        Double revenueToday = rideRepository.sumRevenueToday(startOfDay);

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeRides", activeRides);
        stats.put("onlineDrivers", onlineDrivers);
        stats.put("revenueToday", revenueToday != null ? revenueToday : 0.0);
        stats.put("pendingDrivers", pendingDrivers);
        stats.put("totalDrivers", driverRepository.count());
        stats.put("totalRides", rideRepository.count());

        return ResponseEntity.ok(stats);
    }
}
