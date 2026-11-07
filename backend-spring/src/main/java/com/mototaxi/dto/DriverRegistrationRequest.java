package com.mototaxi.dto;

import com.mototaxi.model.Driver;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DriverRegistrationRequest extends RegisterRequest {

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private Driver.VehicleType vehicleType;

    @NotBlank(message = "Vehicle plate is required")
    private String vehiclePlate;
}
