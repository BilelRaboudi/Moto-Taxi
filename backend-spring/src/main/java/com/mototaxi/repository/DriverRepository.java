package com.mototaxi.repository;

import com.mototaxi.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByUserId(Long userId);

    List<Driver> findByStatus(Driver.DriverStatus status);

    List<Driver> findByIsAvailableTrue();

    long countByIsAvailableTrueAndStatus(Driver.DriverStatus status);

    long countByStatus(Driver.DriverStatus status);
}
