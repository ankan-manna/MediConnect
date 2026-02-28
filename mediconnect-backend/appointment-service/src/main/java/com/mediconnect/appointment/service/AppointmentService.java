package com.mediconnect.appointment.service;

import com.mediconnect.appointment.entity.Appointment;
import com.mediconnect.appointment.exception.BadRequestException;
import com.mediconnect.appointment.kafka.AppointmentEventProducer;
import com.mediconnect.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SlotLockService slotLockService;
    private final AppointmentEventProducer eventProducer;

    @Transactional
    public Appointment book(Long patientUserId, Long doctorProfileId, Long slotId,
                            LocalDate slotDate, LocalTime startTime, LocalTime endTime, String reason) {
        String requestId = UUID.randomUUID().toString();
        if (!slotLockService.tryLock(slotId, requestId)) {
            throw new BadRequestException("Slot is being booked by another user. Please retry.");
        }
        try {
            boolean alreadyBooked = appointmentRepository.existsBySlotIdAndStatusIn(slotId,
                    Arrays.asList(Appointment.AppointmentStatus.SCHEDULED, Appointment.AppointmentStatus.CONFIRMED));
            if (alreadyBooked) {
                slotLockService.unlock(slotId, requestId);
                throw new BadRequestException("Slot already booked");
            }
            Appointment a = Appointment.builder()
                    .patientUserId(patientUserId)
                    .doctorProfileId(doctorProfileId)
                    .slotId(slotId)
                    .slotDate(slotDate)
                    .slotStartTime(startTime)
                    .slotEndTime(endTime)
                    .status(Appointment.AppointmentStatus.SCHEDULED)
                    .reason(reason)
                    .build();
            a = appointmentRepository.save(a);
            eventProducer.sendAppointmentBooked(a);
            return a;
        } finally {
            slotLockService.unlock(slotId, requestId);
        }
    }

    @Transactional
    public Appointment updateStatus(Long appointmentId, Appointment.AppointmentStatus status) {
        Appointment a = appointmentRepository.findById(appointmentId).orElseThrow(() -> new BadRequestException("Appointment not found"));
        a.setStatus(status);
        return appointmentRepository.save(a);
    }

    public List<Appointment> getByPatient(Long patientUserId) {
        return appointmentRepository.findByPatientUserIdAndStatusInOrderBySlotDateDesc(patientUserId,
                Arrays.asList(Appointment.AppointmentStatus.SCHEDULED, Appointment.AppointmentStatus.CONFIRMED, Appointment.AppointmentStatus.COMPLETED));
    }
}
