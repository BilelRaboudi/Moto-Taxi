package com.mototaxi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceEstimateResponse {

    private Double estimatedPrice;
    private Double distance;
    private Integer durationMinutes;
}
