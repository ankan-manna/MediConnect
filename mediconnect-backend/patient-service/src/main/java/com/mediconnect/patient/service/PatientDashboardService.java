package com.mediconnect.patient.service;

import com.mediconnect.patient.dto.ConsentDto;
import com.mediconnect.patient.dto.DashboardResponse;
import com.mediconnect.patient.dto.HealthTimelineEventDto;
import com.mediconnect.patient.entity.HealthTimelineEvent;
import com.mediconnect.patient.entity.PatientConsent;
import com.mediconnect.patient.repository.HealthTimelineRepository;
import com.mediconnect.patient.repository.PatientConsentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientDashboardService {

    private final HealthTimelineRepository healthTimelineRepository;
    private final PatientConsentRepository consentRepository;
    private final RiskScoreService riskScoreService;

    public DashboardResponse getDashboard(Long patientUserId) {
        org.springframework.data.domain.Page<HealthTimelineEvent> recentTimeline =
                healthTimelineRepository
                .findByPatientUserIdOrderByEventDateDesc(patientUserId, PageRequest.of(0, 20));
        List<PatientConsent> consents = consentRepository.findByPatientUserIdAndActiveTrue(patientUserId);
        java.util.Map<String, Double> riskScores = riskScoreService.calculateRiskScores(patientUserId);

        return DashboardResponse.builder()
                .patientUserId(patientUserId)
                .recentTimeline(recentTimeline.getContent().stream().map(this::toDto).collect(Collectors.toList()))
                .riskScores(riskScores)
                .activeConsents(consents.stream().map(this::toConsentDto).collect(Collectors.toList()))
                .latestVitals(null) // placeholder
                .build();
    }

    private HealthTimelineEventDto toDto(HealthTimelineEvent e) {
        HealthTimelineEventDto dto = new HealthTimelineEventDto();
        dto.setId(e.getId());
        dto.setEventType(e.getEventType());
        dto.setEventDate(e.getEventDate());
        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setMetadata(e.getMetadata());
        dto.setSourceService(e.getSourceService());
        return dto;
    }

    private ConsentDto toConsentDto(PatientConsent c) {
        ConsentDto dto = new ConsentDto();
        dto.setId(c.getId());
        dto.setConsentType(c.getConsentType());
        dto.setGrantedToId(c.getGrantedToId());
        dto.setGrantedAt(c.getGrantedAt());
        dto.setExpiresAt(c.getExpiresAt());
        return dto;
    }
}
