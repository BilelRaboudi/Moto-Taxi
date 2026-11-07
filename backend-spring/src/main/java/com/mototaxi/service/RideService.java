package com.mototaxi.service;

import com.mototaxi.dto.PagedResponse;
import com.mototaxi.dto.PriceEstimateRequest;
import com.mototaxi.dto.PriceEstimateResponse;
import com.mototaxi.dto.RideRequest;
import com.mototaxi.dto.RideResponse;
import com.mototaxi.exception.BadRequestException;
import com.mototaxi.exception.ResourceNotFoundException;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Ride;
import com.mototaxi.model.Tariff;
import com.mototaxi.model.User;
import com.mototaxi.repository.DriverRepository;
import com.mototaxi.repository.RideRepository;
import com.mototaxi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final TariffService tariffService;

    public PriceEstimateResponse estimatePrice(PriceEstimateRequest request) {
        double distanceKm = calculateDistance(
                request.getOriginLat(), request.getOriginLng(),
                request.getDestLat(), request.getDestLng()
        );

        Tariff tariff = tariffService.getTariffByVehicleType(request.getVehicleType());
        double price = tariff.getBasePrice() + (distanceKm * tariff.getPricePerKm());
        price = Math.round(price * 100.0) / 100.0;

        int durationMinutes = (int) Math.ceil((distanceKm / 30.0) * 60.0) + 3;

        return PriceEstimateResponse.builder()
                .distance(Math.round(distanceKm * 10.0) / 10.0)
                .estimatedPrice(price)
                .durationMinutes(durationMinutes)
                .build();
    }

    @Transactional
    public RideResponse requestRide(RideRequest request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        PriceEstimateRequest estReq = new PriceEstimateRequest();
        estReq.setOriginLat(request.getOriginLat());
        estReq.setOriginLng(request.getOriginLng());
        estReq.setDestLat(request.getDestLat());
        estReq.setDestLng(request.getDestLng());
        estReq.setVehicleType(request.getVehicleType());

        PriceEstimateResponse estimate = estimatePrice(estReq);

        Ride ride = Ride.builder()
                .customer(customer)
                .originAddress(request.getOriginAddress())
                .originLat(request.getOriginLat())
                .originLng(request.getOriginLng())
                .destAddress(request.getDestAddress())
                .destLat(request.getDestLat())
                .destLng(request.getDestLng())
                .estimatedPrice(estimate.getEstimatedPrice())
                .status(Ride.RideStatus.PENDING)
                .build();

        ride = rideRepository.save(ride);
        return mapToRideResponse(ride);
    }

    @Transactional
    public RideResponse acceptRide(Long rideId, Long driverId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.PENDING) {
            throw new BadRequestException("Ride is no longer available");
        }

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        ride.setDriver(driver);
        ride.setStatus(Ride.RideStatus.ACCEPTED);
        ride = rideRepository.save(ride);

        return mapToRideResponse(ride);
    }

    @Transactional
    public RideResponse startRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.ACCEPTED) {
            throw new BadRequestException("Ride cannot be started in state: " + ride.getStatus());
        }

        ride.setStatus(Ride.RideStatus.IN_PROGRESS);
        ride = rideRepository.save(ride);
        return mapToRideResponse(ride);
    }

    @Transactional
    public RideResponse completeRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.IN_PROGRESS) {
            throw new BadRequestException("Ride is not in progress");
        }

        ride.setStatus(Ride.RideStatus.COMPLETED);
        ride.setFinalPrice(ride.getEstimatedPrice());
        ride.setCompletedAt(LocalDateTime.now());

        if (ride.getDriver() != null) {
            Driver driver = ride.getDriver();
            driver.setTotalEarnings(driver.getTotalEarnings() + ride.getFinalPrice());
            driverRepository.save(driver);
        }

        ride = rideRepository.save(ride);
        return mapToRideResponse(ride);
    }

    @Transactional
    public RideResponse cancelRide(Long rideId, Long userId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() == Ride.RideStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed ride");
        }

        ride.setStatus(Ride.RideStatus.CANCELLED);
        ride = rideRepository.save(ride);
        return mapToRideResponse(ride);
    }

    public List<RideResponse> getRidesByCustomer(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return rideRepository.findByCustomer(customer).stream()
                .map(this::mapToRideResponse)
                .collect(Collectors.toList());
    }

    public List<RideResponse> getRidesByDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return rideRepository.findByDriver(driver).stream()
                .map(this::mapToRideResponse)
                .collect(Collectors.toList());
    }

    public PagedResponse<RideResponse> getAllRides(Pageable pageable) {
        Page<Ride> page = rideRepository.findAll(pageable);
        List<RideResponse> content = page.getContent().stream()
                .map(this::mapToRideResponse)
                .collect(Collectors.toList());

        return PagedResponse.<RideResponse>builder()
                .content(content)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .build();
    }

    public RideResponse getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
        return mapToRideResponse(ride);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public RideResponse mapToRideResponse(Ride ride) {
        String driverName = null;
        String driverPhone = null;
        if (ride.getDriver() != null && ride.getDriver().getUser() != null) {
            driverName = ride.getDriver().getUser().getFirstName() + " " + ride.getDriver().getUser().getLastName();
            driverPhone = ride.getDriver().getUser().getPhone();
        }

        return RideResponse.builder()
                .id(ride.getId())
                .driverName(driverName)
                .driverPhone(driverPhone)
                .originAddress(ride.getOriginAddress())
                .destAddress(ride.getDestAddress())
                .estimatedPrice(ride.getEstimatedPrice())
                .finalPrice(ride.getFinalPrice())
                .status(ride.getStatus())
                .requestedAt(ride.getRequestedAt())
                .build();
    }
}
