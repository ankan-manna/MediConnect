package com.mediconnect.doctor.kafka;

import com.mediconnect.doctor.entity.Prescription;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PrescriptionEventProducer {

    @Value("${app.kafka.topic.prescription-created:prescription-created}")
    private String topic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendPrescriptionCreated(Prescription prescription) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("prescriptionId", prescription.getId());
        payload.put("doctorUserId", prescription.getDoctorUserId());
        payload.put("patientUserId", prescription.getPatientUserId());
        payload.put("appointmentId", prescription.getAppointmentId());
        payload.put("diagnosis", prescription.getDiagnosis());
        payload.put("items", prescription.getItems().stream().map(item -> {
            Map<String, Object> m = new HashMap<>();
            m.put("medicineName", item.getMedicineName());
            m.put("dosage", item.getDosage());
            m.put("frequency", item.getFrequency());
            m.put("duration", item.getDuration());
            return m;
        }).collect(Collectors.toList()));
        payload.put("createdAt", prescription.getCreatedAt() != null ? prescription.getCreatedAt().toString() : null);
        kafkaTemplate.send(topic, prescription.getId(), payload);
    }
}
