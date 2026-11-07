package com.mototaxi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tariffs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Driver.VehicleType vehicleType;

    @Column(nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    private Double pricePerKm;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
