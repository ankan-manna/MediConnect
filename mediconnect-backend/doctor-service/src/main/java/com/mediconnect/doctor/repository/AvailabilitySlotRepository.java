package com.mediconnect.doctor.repository;

import com.mediconnect.doctor.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByDoctorProfileIdAndSlotDateBetweenAndStatus(
            Long doctorProfileId, LocalDate from, LocalDate to, AvailabilitySlot.SlotStatus status);
}
