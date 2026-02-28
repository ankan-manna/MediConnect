package com.mediconnect.pharmacy.kafka;

import com.mediconnect.pharmacy.entity.Order;
import com.mediconnect.pharmacy.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    @Value("${app.kafka.topic.order-placed:order-placed}")
    private String topic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendOrderPlaced(Order order) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("orderId", order.getId());
        payload.put("patientUserId", order.getPatientUserId());
        payload.put("prescriptionId", order.getPrescriptionId());
        payload.put("status", order.getStatus());
        payload.put("items", order.getItems() != null ? order.getItems().stream().map(i -> {
            Map<String, Object> m = new HashMap<>();
            m.put("medicineSku", i.getMedicineSku());
            m.put("medicineName", i.getMedicineName());
            m.put("quantity", i.getQuantity());
            return m;
        }).collect(Collectors.toList()) : java.util.Collections.emptyList());
        payload.put("createdAt", order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
        kafkaTemplate.send(topic, String.valueOf(order.getId()), payload);
    }
}
