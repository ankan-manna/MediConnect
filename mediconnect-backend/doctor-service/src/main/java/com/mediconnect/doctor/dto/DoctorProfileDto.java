package com.mediconnect.doctor.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class DoctorProfileDto {

    private Long id;
    private Long userId;
    private String qualification;
    private String specialization;
    private String registrationNumber;
    private String bio;
    private String consultationFee;
    private Boolean active;
    private Instant createdAt;
}
