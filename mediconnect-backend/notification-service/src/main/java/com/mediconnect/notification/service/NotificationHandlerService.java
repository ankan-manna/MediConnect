package com.mediconnect.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class NotificationHandlerService {

    /** Send email/SMS placeholder - integrate with SendGrid, Twilio, etc. */
    public void handleAppointmentBooked(Map<String, Object> payload) {
        Object patientUserId = payload.get("patientUserId");
        Object slotDate = payload.get("slotDate");
        // emailService.send(patientUserId, "Appointment confirmed", "Your appointment on " + slotDate + " is confirmed.");
        // smsService.send(patientUserId, "Appointment confirmed for " + slotDate);
        log.info("Would send appointment confirmation to patient {}", patientUserId);
    }

    public void handleOrderPlaced(Map<String, Object> payload) {
        Object orderId = payload.get("orderId");
        Object patientUserId = payload.get("patientUserId");
        log.info("Would send order confirmation for order {} to patient {}", orderId, patientUserId);
    }

    public void handleLabReportUploaded(Map<String, Object> payload) {
        Object reportId = payload.get("reportId");
        Object patientUserId = payload.get("patientUserId");
        Boolean hasAbnormal = (Boolean) payload.get("hasAbnormalValues");
        log.info("Would send lab report notification for report {} to patient {}, abnormal={}", reportId, patientUserId, hasAbnormal);
    }

    /** Emergency alert handler - high priority SMS/email/push */
    public void handleEmergency(Map<String, Object> payload) {
        Object patientUserId = payload.get("patientUserId");
        Object message = payload.get("message");
        log.warn("EMERGENCY: Would send alert to patient {}: {}", patientUserId, message);
        // smsService.sendUrgent(patientUserId, message);
        // pushService.sendToEmergencyContacts(patientUserId, message);
    }
}
