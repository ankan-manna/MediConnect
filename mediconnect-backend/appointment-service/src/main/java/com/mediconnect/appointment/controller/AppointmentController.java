package com.mediconnect.appointment.controller;

import com.mediconnect.appointment.entity.Appointment;
import com.mediconnect.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> book(@Valid @RequestBody BookRequest request) {
        Appointment a = appointmentService.book(
                request.getPatientUserId(),
                request.getDoctorProfileId(),
                request.getSlotId(),
                request.getSlotDate(),
                request.getSlotStartTime(),
                request.getSlotEndTime(),
                request.getReason());
        return ResponseEntity.ok(a);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @GetMapping("/patient/{patientUserId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Long patientUserId) {
        return ResponseEntity.ok(appointmentService.getByPatient(patientUserId));
    }

    @lombok.Data
    public static class BookRequest {
        @NotNull private Long patientUserId;
        @NotNull private Long doctorProfileId;
        @NotNull private Long slotId;
        @NotNull private LocalDate slotDate;
        private LocalTime slotStartTime;
        private LocalTime slotEndTime;
        private String reason;
    }
}
