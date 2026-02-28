package com.mediconnect.patient.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ConsentDto {

    private Long id;
    private String consentType;
    private Long grantedToId;
    private Instant grantedAt;
    private Instant expiresAt;
}
