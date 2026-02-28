package com.mediconnect.patient.repository;

import com.mediconnect.patient.entity.PatientConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientConsentRepository extends JpaRepository<PatientConsent, Long> {

    List<PatientConsent> findByPatientUserIdAndActiveTrue(Long patientUserId);

    boolean existsByPatientUserIdAndConsentTypeAndGrantedToIdAndActiveTrue(Long patientUserId, String consentType, Long grantedToId);
}
