package com.mototaxi.controller;

import com.mototaxi.dto.RideResponse;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Ride;
import com.mototaxi.repository.RatingRepository;
import com.mototaxi.repository.RideRepository;
import com.mototaxi.service.DriverService;
import com.mototaxi.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;
    private final RideRepository rideRepository;
    private final RatingRepository ratingRepository;
    private final RideService rideService;

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Driver> getDriverByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(driverService.getDriverByUserId(userId));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Driver> setAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Boolean available = payload.getOrDefault("available", false);
        return ResponseEntity.ok(driverService.setAvailability(id, available));
    }

    @GetMapping("/{id}/earnings")
    public ResponseEntity<Map<String, Double>> getEarnings(@PathVariable Long id) {
        Double earnings = driverService.getEarnings(id);
        return ResponseEntity.ok(Map.of("totalEarnings", earnings != null ? earnings : 0.0));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Driver> updateLocation(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Double lat = payload.get("lat");
        Double lng = payload.get("lng");
        return ResponseEntity.ok(driverService.updateLocation(id, lat, lng));
    }

    @GetMapping("/{id}/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        Double todayEarnings = rideRepository.sumDriverRevenueToday(id, startOfDay);
        long todayRidesCount = rideRepository.countByDriverIdAndStatusAndCompletedAtGreaterThanEqual(
                id, Ride.RideStatus.COMPLETED, startOfDay
        );
        Double avgRating = ratingRepository.findAverageStarsByDriverId(id).orElse(4.9);

        List<RideResponse> recentRides = rideRepository.findTop5ByDriverOrderByRequestedAtDesc(driver)
                .stream()
                .map(rideService::mapToRideResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("todayEarnings", todayEarnings != null ? todayEarnings : 0.0);
        response.put("totalEarnings", driver.getTotalEarnings() != null ? driver.getTotalEarnings() : 0.0);
        response.put("todayRidesCount", todayRidesCount);
        response.put("driverRating", Math.round(avgRating * 10.0) / 10.0);
        response.put("isAvailable", driver.isAvailable());
        response.put("recentTrips", recentRides);

        return ResponseEntity.ok(response);
    }
}
