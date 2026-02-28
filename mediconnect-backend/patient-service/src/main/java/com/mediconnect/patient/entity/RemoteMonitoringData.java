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

@Document(collection = "remote_monitoring")
@CompoundIndex(name = "patient_recorded", def = "{'patientUserId': 1, 'recordedAt': -1}")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemoteMonitoringData {

    @Id
    private String id;

    @Indexed
    private Long patientUserId;

    private String deviceType; // BP_MONITOR, GLUCOSE, WEIGHT, etc.
    private Instant recordedAt;
    private Map<String, Object> readings; // e.g. systolic, diastolic, value
    private String unit;
}
