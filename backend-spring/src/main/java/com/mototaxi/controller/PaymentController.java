package com.mototaxi.controller;

import com.mototaxi.model.Payment;
import com.mototaxi.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> payload) {
        Long rideId = Long.valueOf(payload.get("rideId").toString());
        Payment.PaymentMethod method = Payment.PaymentMethod.valueOf(payload.getOrDefault("method", "CASH").toString());
        return ResponseEntity.ok(paymentService.createPayment(rideId, method));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirmPayment(id));
    }

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<Payment> getPaymentByRideId(@PathVariable Long rideId) {
        return ResponseEntity.ok(paymentService.getPaymentByRideId(rideId));
    }
}
