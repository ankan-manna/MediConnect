package com.mediconnect.patient.service;

import com.mediconnect.patient.entity.RemoteMonitoringData;
import com.mediconnect.patient.repository.RemoteMonitoringRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 * Placeholder risk score calculation (Diabetes, Heart, Hypertension).
 * In production, use clinical algorithms and more data points.
 */
@Service
@RequiredArgsConstructor
public class RiskScoreService {

    private final RemoteMonitoringRepository remoteMonitoringRepository;

    public Map<String, Double> calculateRiskScores(Long patientUserId) {
        Map<String, Double> scores = new HashMap<>();
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        org.springframework.data.domain.Page<RemoteMonitoringData> recent = remoteMonitoringRepository.findByPatientUserIdOrderByRecordedAtDesc(
                patientUserId, PageRequest.of(0, 100));

        double diabetesRisk = 0.0;
        double heartRisk = 0.0;
        double hypertensionRisk = 0.0;

        for (RemoteMonitoringData d : recent.getContent()) {
            if (d.getRecordedAt().isBefore(thirtyDaysAgo)) break;
            Map<String, Object> r = d.getReadings();
            if (r == null) continue;
            if ("GLUCOSE".equals(d.getDeviceType())) {
                Object v = r.get("value");
                if (v instanceof Number) {
                    double val = ((Number) v).doubleValue();
                    if (val > 126) diabetesRisk += 0.2;
                    else if (val > 100) diabetesRisk += 0.1;
                }
            }
            if ("BP_MONITOR".equals(d.getDeviceType())) {
                Object sys = r.get("systolic"), dia = r.get("diastolic");
                if (sys instanceof Number && dia instanceof Number) {
                    double s = ((Number) sys).doubleValue(), di = ((Number) dia).doubleValue();
                    if (s >= 140 || di >= 90) hypertensionRisk += 0.25;
                    else if (s >= 130 || di >= 85) hypertensionRisk += 0.1;
                    if (s > 180 || di > 120) heartRisk += 0.2;
                }
            }
        }

        scores.put("DIABETES", Math.min(1.0, diabetesRisk));
        scores.put("HEART", Math.min(1.0, heartRisk));
        scores.put("HYPERTENSION", Math.min(1.0, hypertensionRisk));
        return scores;
    }
}
