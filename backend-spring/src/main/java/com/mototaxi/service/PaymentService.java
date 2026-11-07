package com.mototaxi.service;

import com.mototaxi.exception.BadRequestException;
import com.mototaxi.exception.ResourceNotFoundException;
import com.mototaxi.model.Payment;
import com.mototaxi.model.Ride;
import com.mototaxi.repository.PaymentRepository;
import com.mototaxi.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;

    @Transactional
    public Payment createPayment(Long rideId, Payment.PaymentMethod method) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (paymentRepository.findByRideId(rideId).isPresent()) {
            throw new BadRequestException("Payment already initiated for this ride");
        }

        Payment payment = Payment.builder()
                .ride(ride)
                .amount(ride.getFinalPrice() != null ? ride.getFinalPrice() : ride.getEstimatedPrice())
                .method(method)
                .status(Payment.PaymentStatus.PENDING)
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment confirmPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByRideId(Long rideId) {
        return paymentRepository.findByRideId(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for ride: " + rideId));
    }
}
