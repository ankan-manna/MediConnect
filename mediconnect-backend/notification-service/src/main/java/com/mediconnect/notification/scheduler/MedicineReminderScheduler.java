package com.mediconnect.notification.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

/**
 * Medicine reminder cron job.
 * In production: load from DB/Redis list of (patientUserId, medicine, time) and send reminders.
 */
@Component
@Slf4j
public class MedicineReminderScheduler {

    @Scheduled(cron = "${app.scheduler.medicine-reminder-cron:0 0 8,14,20 * * *}") // 8am, 2pm, 8pm
    @SchedulerLock(name = "medicineReminder", lockAtMostFor = "5m", lockAtLeastFor = "1m")
    public void sendMedicineReminders() {
        log.info("Medicine reminder job running (placeholder: would query reminders and send SMS/email)");
        // List<Reminder> due = reminderRepository.findDue(now);
        // for (Reminder r : due) { notificationService.sendMedicineReminder(r); }
    }
}
