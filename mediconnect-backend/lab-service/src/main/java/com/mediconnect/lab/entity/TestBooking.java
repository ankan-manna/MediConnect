package com.mediconnect.lab.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "test_bookings", indexes = {
    @Index(name = "idx_booking_patient", columnList = "patient_user_id"),
    @Index(name = "idx_booking_date", columnList = "booking_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;

    private String testName;
    private String testCode;
    private LocalDate bookingDate;
    private LocalTime slotTime;
    private String status; // SCHEDULED, SAMPLE_COLLECTED, REPORT_READY, CANCELLED

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }
}
