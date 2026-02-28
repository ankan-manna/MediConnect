package com.mediconnect.doctor.service;

import com.mediconnect.doctor.dto.DoctorProfileDto;
import com.mediconnect.doctor.entity.DoctorProfile;
import com.mediconnect.doctor.exception.NotFoundException;
import com.mediconnect.doctor.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final DoctorProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public DoctorProfileDto getByUserId(Long userId) {
        DoctorProfile p = profileRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("Doctor profile not found"));
        return toDto(p);
    }

    @Transactional
    public DoctorProfileDto create(Long userId, DoctorProfileDto dto) {
        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Profile already exists");
        }
        DoctorProfile p = DoctorProfile.builder()
                .userId(userId)
                .qualification(dto.getQualification())
                .specialization(dto.getSpecialization())
                .registrationNumber(dto.getRegistrationNumber())
                .bio(dto.getBio())
                .consultationFee(dto.getConsultationFee())
                .active(true)
                .build();
        return toDto(profileRepository.save(p));
    }

    @Transactional
    public DoctorProfileDto update(Long userId, DoctorProfileDto dto) {
        DoctorProfile p = profileRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("Doctor profile not found"));
        if (dto.getQualification() != null) p.setQualification(dto.getQualification());
        if (dto.getSpecialization() != null) p.setSpecialization(dto.getSpecialization());
        if (dto.getRegistrationNumber() != null) p.setRegistrationNumber(dto.getRegistrationNumber());
        if (dto.getBio() != null) p.setBio(dto.getBio());
        if (dto.getConsultationFee() != null) p.setConsultationFee(dto.getConsultationFee());
        if (dto.getActive() != null) p.setActive(dto.getActive());
        return toDto(profileRepository.save(p));
    }

    private DoctorProfileDto toDto(DoctorProfile p) {
        DoctorProfileDto dto = new DoctorProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUserId());
        dto.setQualification(p.getQualification());
        dto.setSpecialization(p.getSpecialization());
        dto.setRegistrationNumber(p.getRegistrationNumber());
        dto.setBio(p.getBio());
        dto.setConsultationFee(p.getConsultationFee());
        dto.setActive(p.getActive());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
