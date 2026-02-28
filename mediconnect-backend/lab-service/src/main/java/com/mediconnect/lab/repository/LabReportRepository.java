package com.mediconnect.lab.repository;

import com.mediconnect.lab.entity.LabReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {

    List<LabReport> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId, org.springframework.data.domain.Pageable pageable);

    List<LabReport> findByBookingId(Long bookingId);
}
