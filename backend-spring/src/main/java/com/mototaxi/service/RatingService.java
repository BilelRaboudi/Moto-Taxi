package com.mototaxi.service;

import com.mototaxi.dto.RatingRequest;
import com.mototaxi.exception.BadRequestException;
import com.mototaxi.exception.ResourceNotFoundException;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Rating;
import com.mototaxi.model.Ride;
import com.mototaxi.model.User;
import com.mototaxi.repository.RatingRepository;
import com.mototaxi.repository.RideRepository;
import com.mototaxi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    @Transactional
    public Rating rateDriver(RatingRequest request, Long customerId) {
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.COMPLETED) {
            throw new BadRequestException("Only completed rides can be rated");
        }

        if (ride.getDriver() == null) {
            throw new BadRequestException("Ride has no assigned driver");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Driver driver = ride.getDriver();

        Rating rating = Rating.builder()
                .ride(ride)
                .customer(customer)
                .driver(driver)
                .stars(request.getStars())
                .comment(request.getComment())
                .build();

        return ratingRepository.save(rating);
    }

    public List<Rating> getDriverRatings(Long driverId) {
        return ratingRepository.findByDriverId(driverId);
    }

    public Double getDriverAverageRating(Long driverId) {
        return ratingRepository.findAverageStarsByDriverId(driverId).orElse(5.0);
    }
}
