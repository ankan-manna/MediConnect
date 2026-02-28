package com.mediconnect.pharmacy.service;

import com.mediconnect.pharmacy.entity.Inventory;
import com.mediconnect.pharmacy.entity.Order;
import com.mediconnect.pharmacy.entity.OrderItem;
import com.mediconnect.pharmacy.kafka.OrderEventProducer;
import com.mediconnect.pharmacy.repository.InventoryRepository;
import com.mediconnect.pharmacy.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderEventProducer orderEventProducer;

    @Transactional
    public Order createOrderFromPrescription(Long patientUserId, String prescriptionId, List<Map<String, Object>> items) {
        Order order = Order.builder()
                .patientUserId(patientUserId)
                .prescriptionId(prescriptionId)
                .status("PENDING")
                .items(new ArrayList<>())
                .build();
        order = orderRepository.save(order);
        for (Map<String, Object> item : items) {
            String medicineName = (String) item.get("medicineName");
            String sku = medicineName != null ? medicineName.replaceAll("\\s+", "_").toUpperCase() : "UNKNOWN";
            Integer qty = item.get("quantity") != null ? ((Number) item.get("quantity")).intValue() : 1;
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMedicineSku(sku);
            oi.setMedicineName(medicineName);
            oi.setQuantity(qty);
            inventoryRepository.findByMedicineSku(sku).ifPresent(inv -> oi.setUnitPrice(inv.getPricePerUnit()));
            order.getItems().add(oi);
        }
        orderRepository.save(order);
        orderEventProducer.sendOrderPlaced(order);
        return order;
    }

    @Transactional
    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
