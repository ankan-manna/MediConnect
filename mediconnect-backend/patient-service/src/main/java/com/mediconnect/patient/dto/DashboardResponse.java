package com.mediconnect.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long patientUserId;
    private List<HealthTimelineEventDto> recentTimeline;
    private Map<String, Double> riskScores; // DIABETES, HEART, HYPERTENSION
    private List<ConsentDto> activeConsents;
    private Object latestVitals; // placeholder for latest remote monitoring summary
}
