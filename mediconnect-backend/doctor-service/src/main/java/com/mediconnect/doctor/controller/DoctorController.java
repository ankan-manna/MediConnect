package com.mediconnect.doctor.controller;

import com.mediconnect.doctor.dto.DoctorProfileDto;
import com.mediconnect.doctor.dto.PrescriptionRequest;
import com.mediconnect.doctor.dto.SlotDto;
import com.mediconnect.doctor.entity.Prescription;
import com.mediconnect.doctor.service.DoctorProfileService;
import com.mediconnect.doctor.service.PrescriptionService;
import com.mediconnect.doctor.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorProfileService profileService;
    private final SlotService slotService;
    private final PrescriptionService prescriptionService;

    @GetMapping("/me/profile")
    public ResponseEntity<DoctorProfileDto> getProfile(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(profileService.getByUserId(userId));
    }

    @PostMapping("/me/profile")
    public ResponseEntity<DoctorProfileDto> createProfile(@RequestHeader("X-User-Id") Long userId,
                                                          @RequestBody DoctorProfileDto dto) {
        return ResponseEntity.ok(profileService.create(userId, dto));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<DoctorProfileDto> updateProfile(@RequestHeader("X-User-Id") Long userId,
                                                           @RequestBody DoctorProfileDto dto) {
        return ResponseEntity.ok(profileService.update(userId, dto));
    }

    @GetMapping("/me/slots")
    public ResponseEntity<List<SlotDto>> getSlots(@RequestHeader("X-User-Id") Long userId,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(slotService.getSlots(userId, from, to));
    }

    @PostMapping("/me/slots")
    public ResponseEntity<SlotDto> createSlot(@RequestHeader("X-User-Id") Long userId, @RequestBody SlotDto dto) {
        return ResponseEntity.ok(slotService.createSlot(userId, dto));
    }

    @PostMapping("/me/prescriptions")
    public ResponseEntity<Prescription> createPrescription(@RequestHeader("X-User-Id") Long userId,
                                                           @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.create(userId, request));
    }

    /** Doctor-to-doctor communication placeholder */
    @PostMapping("/me/communicate")
    public ResponseEntity<Map<String, String>> communicate(@RequestHeader("X-User-Id") Long userId,
                                                            @RequestBody Map<String, Long> body) {
        Long toDoctorId = body.get("toDoctorId");
        return ResponseEntity.ok(Collections.singletonMap("status", "placeholder"));
    }
}
