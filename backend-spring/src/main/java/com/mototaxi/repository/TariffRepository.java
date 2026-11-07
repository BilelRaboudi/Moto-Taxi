package com.mototaxi.repository;

import com.mototaxi.model.Driver;
import com.mototaxi.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, Long> {

    Optional<Tariff> findByVehicleType(Driver.VehicleType vehicleType);
}
