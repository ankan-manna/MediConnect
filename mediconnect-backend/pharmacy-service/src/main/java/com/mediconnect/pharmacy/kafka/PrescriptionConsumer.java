package com.mediconnect.pharmacy.kafka;

import com.mediconnect.pharmacy.service.PrescriptionHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class PrescriptionConsumer {

    private final PrescriptionHandlerService prescriptionHandlerService;

    @KafkaListener(topics = "${app.kafka.topic.prescription-created:prescription-created}", groupId = "pharmacy-service")
    public void consume(Map<String, Object> payload) {
        try {
            log.info("Received prescription-created: {}", payload.get("prescriptionId"));
            prescriptionHandlerService.handlePrescriptionCreated(payload);
        } catch (Exception e) {
            log.error("Error processing prescription event", e);
            // Dead letter / retry placeholder
        }
    }
}
