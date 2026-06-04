package com.scems.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Allow access from both laptop and phone IP
public class PaymentController {

    // Simple in-memory store for transaction statuses
    // Key: transactionId, Value: status (e.g., "PENDING", "SUCCESS")
    private final Map<String, String> transactionStatuses = new ConcurrentHashMap<>();

    @PostMapping("/init/{txnId}")
    public ResponseEntity<?> initPayment(@PathVariable String txnId) {
        transactionStatuses.put(txnId, "PENDING");
        return ResponseEntity.ok(Map.of("message", "Transaction initialized", "txnId", txnId, "status", "PENDING"));
    }

    @GetMapping("/status/{txnId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String txnId) {
        String status = transactionStatuses.getOrDefault(txnId, "NOT_FOUND");
        return ResponseEntity.ok(Map.of("txnId", txnId, "status", status));
    }

    @PostMapping("/success/{txnId}")
    public ResponseEntity<?> markPaymentSuccess(@PathVariable String txnId) {
        if (transactionStatuses.containsKey(txnId)) {
            transactionStatuses.put(txnId, "SUCCESS");
            return ResponseEntity.ok(Map.of("message", "Payment marked as successful", "txnId", txnId));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Transaction not found"));
    }
}
