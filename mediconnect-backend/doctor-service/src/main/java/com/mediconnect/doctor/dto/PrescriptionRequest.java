package com.mediconnect.doctor.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class PrescriptionRequest {

    @NotNull
    private Long patientUserId;
    private Long appointmentId;
    private String diagnosis;
    private String notes;
    @Valid
    private List<PrescriptionItemDto> items;

    @Data
    public static class PrescriptionItemDto {
        private String medicineName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
    }
}
