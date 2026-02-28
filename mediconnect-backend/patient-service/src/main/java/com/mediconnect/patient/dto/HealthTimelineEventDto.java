package com.mediconnect.patient.dto;

import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class HealthTimelineEventDto {

    private String id;
    private String eventType;
    private Instant eventDate;
    private String title;
    private String description;
    private Map<String, Object> metadata;
    private String sourceService;
}
