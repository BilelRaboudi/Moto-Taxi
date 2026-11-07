package com.mototaxi.dto;

import com.mototaxi.model.Ride;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideResponse {

    private Long id;
    private String driverName;
    private String driverPhone;
    private String originAddress;
    private String destAddress;
    private Double estimatedPrice;
    private Double finalPrice;
    private Ride.RideStatus status;
    private LocalDateTime requestedAt;
}
