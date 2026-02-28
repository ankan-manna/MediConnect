package com.mediconnect.patient.service;

import com.mediconnect.patient.entity.PatientConsent;
import com.mediconnect.patient.repository.PatientConsentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsentService {

    private final PatientConsentRepository consentRepository;

    @Transactional
    public PatientConsent grantConsent(Long patientUserId, String consentType, Long grantedToId, java.time.Instant expiresAt) {
        if (consentRepository.existsByPatientUserIdAndConsentTypeAndGrantedToIdAndActiveTrue(patientUserId, consentType, grantedToId)) {
            return consentRepository.findByPatientUserIdAndActiveTrue(patientUserId).stream()
                    .filter(c -> consentType.equals(c.getConsentType()) && grantedToId != null && grantedToId.equals(c.getGrantedToId()))
                    .findFirst().orElseThrow(() -> new RuntimeException("Consent not found"));
        }
        PatientConsent consent = PatientConsent.builder()
                .patientUserId(patientUserId)
                .consentType(consentType)
                .grantedToId(grantedToId)
                .active(true)
                .expiresAt(expiresAt)
                .build();
        return consentRepository.save(consent);
    }

    @Transactional
    public void revokeConsent(Long consentId, Long patientUserId) {
        consentRepository.findById(consentId).ifPresent(c -> {
            if (c.getPatientUserId().equals(patientUserId)) {
                c.setActive(false);
                consentRepository.save(c);
            }
        });
    }

    public List<PatientConsent> listConsents(Long patientUserId) {
        return consentRepository.findByPatientUserIdAndActiveTrue(patientUserId);
    }
}
