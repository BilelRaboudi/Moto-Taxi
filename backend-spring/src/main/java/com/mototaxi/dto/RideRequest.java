package com.mototaxi.dto;

import com.mototaxi.model.Driver;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RideRequest {

    @NotBlank(message = "Origin address is required")
    private String originAddress;

    @NotNull(message = "Origin latitude is required")
    private Double originLat;

    @NotNull(message = "Origin longitude is required")
    private Double originLng;

    @NotBlank(message = "Destination address is required")
    private String destAddress;

    @NotNull(message = "Destination latitude is required")
    private Double destLat;

    @NotNull(message = "Destination longitude is required")
    private Double destLng;

    @NotNull(message = "Vehicle type is required")
    private Driver.VehicleType vehicleType;
}
