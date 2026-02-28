package com.mediconnect.lab.repository;

import com.mediconnect.lab.entity.TestBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestBookingRepository extends JpaRepository<TestBooking, Long> {

    List<TestBooking> findByPatientUserIdOrderByBookingDateDesc(Long patientUserId, org.springframework.data.domain.Pageable pageable);
}
