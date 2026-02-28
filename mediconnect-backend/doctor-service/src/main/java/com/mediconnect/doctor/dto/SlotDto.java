package com.mediconnect.doctor.dto;

import com.mediconnect.doctor.entity.AvailabilitySlot;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotDto {

    private Long id;
    private Long doctorProfileId;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AvailabilitySlot.SlotStatus status;
}
