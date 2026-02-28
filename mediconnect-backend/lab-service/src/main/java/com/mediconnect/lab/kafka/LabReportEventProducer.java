package com.mediconnect.lab.kafka;

import com.mediconnect.lab.entity.LabReport;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LabReportEventProducer {

    @Value("${app.kafka.topic.lab-report-uploaded:lab-report-uploaded}")
    private String topic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendLabReportUploaded(LabReport report) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("reportId", report.getId());
        payload.put("patientUserId", report.getPatientUserId());
        payload.put("bookingId", report.getBookingId());
        payload.put("testName", report.getTestName());
        payload.put("hasAbnormalValues", report.getHasAbnormalValues());
        payload.put("createdAt", report.getCreatedAt() != null ? report.getCreatedAt().toString() : null);
        if (report.getValues() != null) {
            payload.put("values", report.getValues().stream().map(v -> {
                Map<String, Object> m = new HashMap<>();
                m.put("parameterName", v.getParameterName());
                m.put("value", v.getValue());
                m.put("abnormal", v.getAbnormal() != null && v.getAbnormal());
                return m;
            }).collect(Collectors.toList()));
        }
        kafkaTemplate.send(topic, report.getId(), payload);
    }
}
