package com.mototaxi.dto;

import com.mototaxi.model.Driver;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PriceEstimateRequest {

    @NotNull(message = "Origin latitude is required")
    private Double originLat;

    @NotNull(message = "Origin longitude is required")
    private Double originLng;

    @NotNull(message = "Destination latitude is required")
    private Double destLat;

    @NotNull(message = "Destination longitude is required")
    private Double destLng;

    @NotNull(message = "Vehicle type is required")
    private Driver.VehicleType vehicleType;
}
