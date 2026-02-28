package com.mediconnect.patient.repository;

import com.mediconnect.patient.entity.RemoteMonitoringData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface RemoteMonitoringRepository extends MongoRepository<RemoteMonitoringData, String> {

    Page<RemoteMonitoringData> findByPatientUserIdOrderByRecordedAtDesc(Long patientUserId, Pageable pageable);

    Page<RemoteMonitoringData> findByPatientUserIdAndDeviceTypeAndRecordedAtBetween(
            Long patientUserId, String deviceType, Instant from, Instant to, Pageable pageable);
}
