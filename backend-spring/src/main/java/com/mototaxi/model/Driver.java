package com.mototaxi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false)
    private String vehiclePlate;

    @Column(nullable = false)
    @Builder.Default
    private boolean isAvailable = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DriverStatus status = DriverStatus.PENDING;

    private Double currentLat;

    private Double currentLng;

    @Builder.Default
    private Double totalEarnings = 0.0;

    private String documents;

    public enum VehicleType {
        MOTO, TAXI, EXPRESS
    }

    public enum DriverStatus {
        PENDING, VALIDATED, REFUSED
    }
}
