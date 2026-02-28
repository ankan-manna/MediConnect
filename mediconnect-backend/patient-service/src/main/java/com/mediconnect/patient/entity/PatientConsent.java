package com.mediconnect.patient.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "patient_consents", indexes = {
    @Index(name = "idx_patient_consent", columnList = "patient_user_id, consent_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;

    @Column(name = "consent_type", nullable = false, length = 100)
    private String consentType; // e.g. DOCTOR_ACCESS, LAB_ACCESS, PHARMACY_ACCESS

    @Column(name = "granted_to_id") // doctor/lab/pharmacy user or entity id
    private Long grantedToId;

    private Boolean active = true;

    private Instant grantedAt;
    private Instant expiresAt;

    @PrePersist
    void prePersist() {
        if (grantedAt == null) grantedAt = Instant.now();
    }
}
