package com.mediconnect.doctor.service;

import com.mediconnect.doctor.dto.PrescriptionRequest;
import com.mediconnect.doctor.entity.Prescription;
import com.mediconnect.doctor.kafka.PrescriptionEventProducer;
import com.mediconnect.doctor.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionEventProducer eventProducer;

    public Prescription create(Long doctorUserId, PrescriptionRequest request) {
        List<Prescription.PrescriptionItem> items = request.getItems() != null ? request.getItems().stream()
                .map(i -> new Prescription.PrescriptionItem(i.getMedicineName(), i.getDosage(), i.getFrequency(), i.getDuration(), i.getInstructions()))
                .collect(Collectors.toList()) : Collections.emptyList();
        Prescription p = Prescription.builder()
                .doctorUserId(doctorUserId)
                .patientUserId(request.getPatientUserId())
                .appointmentId(request.getAppointmentId())
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .items(items)
                .createdAt(Instant.now())
                .build();
        p = prescriptionRepository.save(p);
        eventProducer.sendPrescriptionCreated(p);
        return p;
    }
}
