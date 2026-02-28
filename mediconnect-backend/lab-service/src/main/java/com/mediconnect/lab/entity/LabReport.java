package com.mediconnect.lab.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document(collection = "lab_reports")
@CompoundIndex(name = "patient_created", def = "{'patientUserId': 1, 'createdAt': -1}")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReport {

    @Id
    private String id;

    @Indexed
    private Long patientUserId;

    private Long bookingId;
    private String testName;
    private String testCode;
    private Instant reportDate;
    private String reportUrl; // or base64 placeholder
    private List<ReportValue> values;
    private Boolean hasAbnormalValues;
    private String uploadedBy;
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportValue {
        private String parameterName;
        private String value;
        private String unit;
        private String referenceRange;
        private Boolean abnormal;
    }
}
