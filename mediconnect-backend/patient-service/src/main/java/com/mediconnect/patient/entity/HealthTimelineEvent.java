package com.mediconnect.patient.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Document(collection = "health_timeline")
@CompoundIndex(name = "patient_date", def = "{'patientUserId': 1, 'eventDate': -1}")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthTimelineEvent {

    @Id
    private String id;

    @Indexed
    private Long patientUserId;

    private String eventType; // APPOINTMENT, PRESCRIPTION, LAB_REPORT, VITAL, MEDICATION
    private Instant eventDate;
    private String title;
    private String description;
    private Map<String, Object> metadata;
    private String sourceService; // appointment-service, lab-service, etc.
    private String referenceId; // external id (appointment id, report id, etc.)
}
