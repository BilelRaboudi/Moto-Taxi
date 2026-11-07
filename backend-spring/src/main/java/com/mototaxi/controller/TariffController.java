package com.mototaxi.controller;

import com.mototaxi.dto.TariffRequest;
import com.mototaxi.model.Driver;
import com.mototaxi.model.Tariff;
import com.mototaxi.service.TariffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TariffController {

    private final TariffService tariffService;

    @GetMapping
    public ResponseEntity<List<Tariff>> getAllTariffs() {
        return ResponseEntity.ok(tariffService.getAllTariffs());
    }

    @GetMapping("/{vehicleType}")
    public ResponseEntity<Tariff> getTariffByVehicleType(@PathVariable Driver.VehicleType vehicleType) {
        return ResponseEntity.ok(tariffService.getTariffByVehicleType(vehicleType));
    }

    @PutMapping("/{vehicleType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tariff> updateTariff(@PathVariable Driver.VehicleType vehicleType,
                                               @Valid @RequestBody TariffRequest request) {
        return ResponseEntity.ok(tariffService.updateTariff(vehicleType, request));
    }
}
