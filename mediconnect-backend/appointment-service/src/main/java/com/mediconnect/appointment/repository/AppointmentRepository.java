package com.mediconnect.appointment.repository;

import com.mediconnect.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientUserIdAndStatusInOrderBySlotDateDesc(Long patientUserId, List<Appointment.AppointmentStatus> statuses);

    List<Appointment> findByDoctorProfileIdAndSlotDateAndStatus(Long doctorProfileId, LocalDate slotDate, Appointment.AppointmentStatus status);

    boolean existsBySlotIdAndStatusIn(Long slotId, List<Appointment.AppointmentStatus> activeStatuses);
}
