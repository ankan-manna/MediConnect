package com.mediconnect.notification.kafka;

import com.mediconnect.notification.service.NotificationHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationHandlerService notificationHandlerService;

    @KafkaListener(topics = "${app.kafka.topic.appointment-booked:appointment-booked}", groupId = "notification-service")
    public void consumeAppointmentBooked(Map<String, Object> payload) {
        try {
            log.info("Appointment booked: {}", payload.get("appointmentId"));
            notificationHandlerService.handleAppointmentBooked(payload);
        } catch (Exception e) {
            log.error("Error processing appointment-booked", e);
        }
    }

    @KafkaListener(topics = "${app.kafka.topic.order-placed:order-placed}", groupId = "notification-service")
    public void consumeOrderPlaced(Map<String, Object> payload) {
        try {
            log.info("Order placed: {}", payload.get("orderId"));
            notificationHandlerService.handleOrderPlaced(payload);
        } catch (Exception e) {
            log.error("Error processing order-placed", e);
        }
    }

    @KafkaListener(topics = "${app.kafka.topic.lab-report-uploaded:lab-report-uploaded}", groupId = "notification-service")
    public void consumeLabReportUploaded(Map<String, Object> payload) {
        try {
            log.info("Lab report uploaded: {}", payload.get("reportId"));
            notificationHandlerService.handleLabReportUploaded(payload);
        } catch (Exception e) {
            log.error("Error processing lab-report-uploaded", e);
        }
    }

    @KafkaListener(topics = "${app.kafka.topic.emergency-triggered:emergency-triggered}", groupId = "notification-service")
    public void consumeEmergencyTriggered(Map<String, Object> payload) {
        try {
            log.info("Emergency triggered: {}", payload);
            notificationHandlerService.handleEmergency(payload);
        } catch (Exception e) {
            log.error("Error processing emergency-triggered", e);
        }
    }
}
