package com.mediconnect.lab.controller;

import com.mediconnect.lab.entity.LabReport;
import com.mediconnect.lab.entity.TestBooking;
import com.mediconnect.lab.repository.TestBookingRepository;
import com.mediconnect.lab.service.LabReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
public class LabController {

    private final TestBookingRepository bookingRepository;
    private final LabReportService reportService;

    @PostMapping("/bookings")
    public ResponseEntity<TestBooking> createBooking(@Valid @RequestBody TestBooking request) {
        return ResponseEntity.ok(bookingRepository.save(request));
    }

    @GetMapping("/bookings/patient/{patientUserId}")
    public ResponseEntity<List<TestBooking>> getBookings(@PathVariable Long patientUserId,
                                                          @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bookingRepository.findByPatientUserIdOrderByBookingDateDesc(patientUserId, PageRequest.of(0, size)));
    }

    @PostMapping("/reports/upload")
    public ResponseEntity<LabReport> uploadReport(@RequestBody Map<String, Object> body) {
        Long patientUserId = body.get("patientUserId") != null ? ((Number) body.get("patientUserId")).longValue() : null;
        Long bookingId = body.get("bookingId") != null ? ((Number) body.get("bookingId")).longValue() : null;
        String testName = (String) body.get("testName");
        String testCode = (String) body.get("testCode");
        String reportUrl = (String) body.get("reportUrl");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> valueMaps = (List<Map<String, Object>>) body.get("values");
        List<LabReport.ReportValue> values = null;
        if (valueMaps != null) {
            values = valueMaps.stream().map(m -> new LabReport.ReportValue(
                    (String) m.get("parameterName"),
                    (String) m.get("value"),
                    (String) m.get("unit"),
                    (String) m.get("referenceRange"),
                    (Boolean) m.get("abnormal")
            )).collect(Collectors.toList());
        }
        return ResponseEntity.ok(reportService.uploadReport(patientUserId, bookingId, testName, testCode, values, reportUrl));
    }
}
