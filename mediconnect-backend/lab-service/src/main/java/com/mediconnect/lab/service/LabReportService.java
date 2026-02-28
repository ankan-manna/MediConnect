package com.mediconnect.lab.service;

import com.mediconnect.lab.entity.LabReport;
import com.mediconnect.lab.kafka.LabReportEventProducer;
import com.mediconnect.lab.repository.LabReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabReportService {

    private final LabReportRepository reportRepository;
    private final LabReportEventProducer eventProducer;

    public LabReport uploadReport(Long patientUserId, Long bookingId, String testName, String testCode,
                                   List<LabReport.ReportValue> values, String reportUrl) {
        boolean hasAbnormal = values != null && values.stream().anyMatch(v -> Boolean.TRUE.equals(v.getAbnormal()));
        LabReport report = LabReport.builder()
                .patientUserId(patientUserId)
                .bookingId(bookingId)
                .testName(testName)
                .testCode(testCode)
                .reportDate(Instant.now())
                .reportUrl(reportUrl)
                .values(values)
                .hasAbnormalValues(hasAbnormal)
                .createdAt(Instant.now())
                .build();
        report = reportRepository.save(report);
        eventProducer.sendLabReportUploaded(report);
        return report;
    }

    /** Simple abnormal detection: flag if value is outside reference or marked abnormal */
    public static boolean detectAbnormal(List<LabReport.ReportValue> values) {
        if (values == null) return false;
        return values.stream().anyMatch(v -> Boolean.TRUE.equals(v.getAbnormal()));
    }
}
