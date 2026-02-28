package com.mediconnect.patient.repository;

import com.mediconnect.patient.entity.HealthTimelineEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface HealthTimelineRepository extends MongoRepository<HealthTimelineEvent, String> {

    Page<HealthTimelineEvent> findByPatientUserIdOrderByEventDateDesc(Long patientUserId, Pageable pageable);

    Page<HealthTimelineEvent> findByPatientUserIdAndEventDateBetweenOrderByEventDateDesc(
            Long patientUserId, Instant from, Instant to, Pageable pageable);
}
