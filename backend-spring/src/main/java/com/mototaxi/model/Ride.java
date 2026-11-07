package com.mototaxi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(nullable = false)
    private String originAddress;

    @Column(nullable = false)
    private Double originLat;

    @Column(nullable = false)
    private Double originLng;

    @Column(nullable = false)
    private String destAddress;

    @Column(nullable = false)
    private Double destLat;

    @Column(nullable = false)
    private Double destLng;

    private Double estimatedPrice;

    private Double finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RideStatus status = RideStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime completedAt;

    public enum RideStatus {
        PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
