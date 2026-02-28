package com.mediconnect.appointment.scheduler;

import com.mediconnect.appointment.entity.Appointment;
import com.mediconnect.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AppointmentScheduler {

    private final AppointmentRepository appointmentRepository;

    /** Expired appointment auto-update: mark past appointments as EXPIRED or COMPLETED */
    @Scheduled(cron = "${app.scheduler.expired-appointment-cron:0 */15 * * * *}") // every 15 min
    @Transactional
    @net.javacrumbs.shedlock.spring.annotation.SchedulerLock(name = "expiredAppointmentUpdate", lockAtMostFor = "5m", lockAtLeastFor = "1m")
    public void updateExpiredAppointments() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<Appointment> scheduled = appointmentRepository.findAll().stream()
                .filter(a -> a.getStatus() == Appointment.AppointmentStatus.SCHEDULED
                        || a.getStatus() == Appointment.AppointmentStatus.CONFIRMED)
                .filter(a -> a.getSlotDate() != null && (a.getSlotDate().isBefore(today)
                        || (a.getSlotDate().equals(today) && a.getSlotEndTime() != null && a.getSlotEndTime().isBefore(now))))
                .collect(Collectors.toList());
        for (Appointment a : scheduled) {
            a.setStatus(Appointment.AppointmentStatus.EXPIRED);
            appointmentRepository.save(a);
        }
    }
}
