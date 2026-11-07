package com.mototaxi.repository;

import com.mototaxi.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByDriverId(Long driverId);

    List<Rating> findByCustomerId(Long customerId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.driver.id = :driverId")
    Optional<Double> findAverageStarsByDriverId(Long driverId);
}
