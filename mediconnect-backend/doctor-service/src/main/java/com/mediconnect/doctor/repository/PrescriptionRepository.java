package com.mediconnect.doctor.repository;

import com.mediconnect.doctor.entity.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    Page<Prescription> findByDoctorUserIdOrderByCreatedAtDesc(Long doctorUserId, Pageable pageable);

    Page<Prescription> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId, Pageable pageable);
}
