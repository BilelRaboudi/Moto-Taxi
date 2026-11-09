package com.mototaxi.app.model;

public class Tariff {
    private Long id;
    private String vehicleType;
    private Double basePrice;
    private Double pricePerKm;

    public Long getId() { return id; }
    public String getVehicleType() { return vehicleType; }
    public Double getBasePrice() { return basePrice; }
    public Double getPricePerKm() { return pricePerKm; }
}
