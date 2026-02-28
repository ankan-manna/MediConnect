package com.mediconnect.pharmacy.controller;

import com.mediconnect.pharmacy.entity.Inventory;
import com.mediconnect.pharmacy.entity.Order;
import com.mediconnect.pharmacy.repository.InventoryRepository;
import com.mediconnect.pharmacy.repository.OrderRepository;
import com.mediconnect.pharmacy.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> listInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping("/inventory")
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory body) {
        return ResponseEntity.ok(inventoryRepository.save(body));
    }

    @GetMapping("/orders/patient/{patientUserId}")
    public ResponseEntity<List<Order>> getOrdersByPatient(@PathVariable Long patientUserId,
                                                            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderRepository.findByPatientUserIdOrderByCreatedAtDesc(patientUserId, PageRequest.of(0, size)));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }
}
