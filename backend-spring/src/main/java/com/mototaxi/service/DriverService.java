package com.mototaxi.service;

import com.mototaxi.exception.ResourceNotFoundException;
import com.mototaxi.model.Driver;
import com.mototaxi.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }

    public Driver getDriverByUserId(Long userId) {
        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user id: " + userId));
    }

    @Transactional
    public Driver setAvailability(Long driverId, boolean available) {
        Driver driver = getDriverById(driverId);
        driver.setAvailable(available);
        return driverRepository.save(driver);
    }

    public Double getEarnings(Long driverId) {
        Driver driver = getDriverById(driverId);
        return driver.getTotalEarnings();
    }

    public List<Driver> getPendingDrivers() {
        return driverRepository.findByStatus(Driver.DriverStatus.PENDING);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Transactional
    public Driver validateDriver(Long driverId) {
        Driver driver = getDriverById(driverId);
        driver.setStatus(Driver.DriverStatus.VALIDATED);
        return driverRepository.save(driver);
    }

    @Transactional
    public Driver refuseDriver(Long driverId) {
        Driver driver = getDriverById(driverId);
        driver.setStatus(Driver.DriverStatus.REFUSED);
        return driverRepository.save(driver);
    }

    @Transactional
    public Driver updateLocation(Long driverId, Double lat, Double lng) {
        Driver driver = getDriverById(driverId);
        driver.setCurrentLat(lat);
        driver.setCurrentLng(lng);
        return driverRepository.save(driver);
    }
}
