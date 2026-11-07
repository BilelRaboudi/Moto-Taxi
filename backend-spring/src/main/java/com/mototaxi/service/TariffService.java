package com.mototaxi.service;

import com.mototaxi.dto.TariffRequest;
import com.mototaxi.exception.ResourceNotFoundException;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Tariff;
import com.mototaxi.repository.TariffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;

    public List<Tariff> getAllTariffs() {
        return tariffRepository.findAll();
    }

    public Tariff getTariffByVehicleType(Driver.VehicleType vehicleType) {
        return tariffRepository.findByVehicleType(vehicleType)
                .orElseThrow(() -> new ResourceNotFoundException("Tariff not found for " + vehicleType));
    }

    public Tariff updateTariff(Driver.VehicleType vehicleType, TariffRequest request) {
        Tariff tariff = tariffRepository.findByVehicleType(vehicleType)
                .orElse(Tariff.builder().vehicleType(vehicleType).build());

        tariff.setBasePrice(request.getBasePrice());
        tariff.setPricePerKm(request.getPricePerKm());

        return tariffRepository.save(tariff);
    }
}
