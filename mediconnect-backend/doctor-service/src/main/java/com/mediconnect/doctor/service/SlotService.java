package com.mediconnect.doctor.service;

import com.mediconnect.doctor.dto.SlotDto;
import com.mediconnect.doctor.entity.AvailabilitySlot;
import com.mediconnect.doctor.entity.DoctorProfile;
import com.mediconnect.doctor.exception.NotFoundException;
import com.mediconnect.doctor.repository.AvailabilitySlotRepository;
import com.mediconnect.doctor.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final DoctorProfileRepository profileRepository;
    private final AvailabilitySlotRepository slotRepository;

    @Transactional
    public SlotDto createSlot(Long doctorUserId, SlotDto dto) {
        DoctorProfile profile = profileRepository.findByUserId(doctorUserId).orElseThrow(() -> new NotFoundException("Doctor profile not found"));
        AvailabilitySlot slot = AvailabilitySlot.builder()
                .doctorProfileId(profile.getId())
                .slotDate(dto.getSlotDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(AvailabilitySlot.SlotStatus.AVAILABLE)
                .build();
        return toDto(slotRepository.save(slot));
    }

    @Transactional(readOnly = true)
    public List<SlotDto> getSlots(Long doctorUserId, LocalDate from, LocalDate to) {
        DoctorProfile profile = profileRepository.findByUserId(doctorUserId).orElseThrow(() -> new NotFoundException("Doctor profile not found"));
        List<AvailabilitySlot> slots = slotRepository.findByDoctorProfileIdAndSlotDateBetweenAndStatus(
                profile.getId(), from, to, AvailabilitySlot.SlotStatus.AVAILABLE);
        return slots.stream().map(this::toDto).collect(Collectors.toList());
    }

    private SlotDto toDto(AvailabilitySlot s) {
        SlotDto dto = new SlotDto();
        dto.setId(s.getId());
        dto.setDoctorProfileId(s.getDoctorProfileId());
        dto.setSlotDate(s.getSlotDate());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        dto.setStatus(s.getStatus());
        return dto;
    }
}
