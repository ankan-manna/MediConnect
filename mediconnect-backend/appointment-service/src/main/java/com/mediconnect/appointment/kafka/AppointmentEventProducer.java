package com.mediconnect.appointment.kafka;

import com.mediconnect.appointment.entity.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AppointmentEventProducer {

    @Value("${app.kafka.topic.appointment-booked:appointment-booked}")
    private String topic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendAppointmentBooked(Appointment appointment) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("appointmentId", appointment.getId());
        payload.put("patientUserId", appointment.getPatientUserId());
        payload.put("doctorProfileId", appointment.getDoctorProfileId());
        payload.put("slotId", appointment.getSlotId() != null ? appointment.getSlotId() : "");
        payload.put("slotDate", appointment.getSlotDate() != null ? appointment.getSlotDate().toString() : "");
        payload.put("slotStartTime", appointment.getSlotStartTime() != null ? appointment.getSlotStartTime().toString() : "");
        payload.put("slotEndTime", appointment.getSlotEndTime() != null ? appointment.getSlotEndTime().toString() : "");
        payload.put("status", appointment.getStatus().name());
        payload.put("createdAt", appointment.getCreatedAt() != null ? appointment.getCreatedAt().toString() : "");
        kafkaTemplate.send(topic, String.valueOf(appointment.getId()), payload);
    }
}
