package com.mototaxi.controller;

import com.mototaxi.dto.PriceEstimateRequest;
import com.mototaxi.dto.PriceEstimateResponse;
import com.mototaxi.dto.RideRequest;
import com.mototaxi.dto.RideResponse;
import com.mototaxi.model.User;
import com.mototaxi.repository.UserRepository;
import com.mototaxi.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;
    private final UserRepository userRepository;

    @PostMapping("/estimate")
    public ResponseEntity<PriceEstimateResponse> estimatePrice(@Valid @RequestBody PriceEstimateRequest request) {
        return ResponseEntity.ok(rideService.estimatePrice(request));
    }

    @PostMapping
    public ResponseEntity<RideResponse> requestRide(@Valid @RequestBody RideRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return ResponseEntity.ok(rideService.requestRide(request, user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRideById(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRideById(id));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<RideResponse> acceptRide(@PathVariable Long id, @RequestParam Long driverId) {
        return ResponseEntity.ok(rideService.acceptRide(id, driverId));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<RideResponse> startRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.startRide(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<RideResponse> completeRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.completeRide(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<RideResponse> cancelRide(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return ResponseEntity.ok(rideService.cancelRide(id, user.getId()));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<RideResponse>> getRidesByCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRidesByCustomer(id));
    }

    @GetMapping("/driver/{id}")
    public ResponseEntity<List<RideResponse>> getRidesByDriver(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRidesByDriver(id));
    }
}
