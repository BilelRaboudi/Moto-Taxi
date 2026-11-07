package com.mototaxi.controller;

import com.mototaxi.dto.RatingRequest;
import com.mototaxi.model.Rating;
import com.mototaxi.model.User;
import com.mototaxi.repository.UserRepository;
import com.mototaxi.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RatingController {

    private final RatingService ratingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Rating> rateDriver(@Valid @RequestBody RatingRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return ResponseEntity.ok(ratingService.rateDriver(request, user.getId()));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Rating>> getDriverRatings(@PathVariable Long driverId) {
        return ResponseEntity.ok(ratingService.getDriverRatings(driverId));
    }

    @GetMapping("/driver/{driverId}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long driverId) {
        Double avg = ratingService.getDriverAverageRating(driverId);
        return ResponseEntity.ok(Map.of("averageStars", avg));
    }
}
