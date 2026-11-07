package com.mototaxi.repository;

import com.mototaxi.model.Driver;
import com.mototaxi.model.Ride;
import com.mototaxi.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByCustomer(User customer);

    List<Ride> findByDriver(Driver driver);

    List<Ride> findByStatus(Ride.RideStatus status);

    List<Ride> findByCustomerAndStatusIn(User customer, List<Ride.RideStatus> statuses);

    Page<Ride> findAll(Pageable pageable);

    long countByStatusIn(List<Ride.RideStatus> statuses);

    long countByStatus(Ride.RideStatus status);

    @Query("SELECT COALESCE(SUM(r.finalPrice), 0.0) FROM Ride r WHERE r.status = 'COMPLETED' AND r.completedAt >= :startOfDay")
    Double sumRevenueToday(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT COALESCE(SUM(r.finalPrice), 0.0) FROM Ride r WHERE r.driver.id = :driverId AND r.status = 'COMPLETED' AND r.completedAt >= :startOfDay")
    Double sumDriverRevenueToday(@Param("driverId") Long driverId, @Param("startOfDay") LocalDateTime startOfDay);

    long countByDriverIdAndStatusAndCompletedAtGreaterThanEqual(Long driverId, Ride.RideStatus status, LocalDateTime startOfDay);

    List<Ride> findTop5ByDriverOrderByRequestedAtDesc(Driver driver);

    List<Ride> findTop5ByCustomerOrderByRequestedAtDesc(User customer);
}
