package com.mototaxi.dto;

import com.mototaxi.model.Driver;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TariffRequest {

    @NotNull(message = "Vehicle type is required")
    private Driver.VehicleType vehicleType;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private Double basePrice;

    @NotNull(message = "Price per km is required")
    @Positive(message = "Price per km must be positive")
    private Double pricePerKm;
}
