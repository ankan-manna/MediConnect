package com.mediconnect.patient.controller;

import com.mediconnect.patient.dto.DashboardResponse;
import com.mediconnect.patient.entity.PatientConsent;
import com.mediconnect.patient.service.ConsentService;
import com.mediconnect.patient.service.PatientDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientDashboardService dashboardService;
    private final ConsentService consentService;

    @GetMapping("/me/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardResponse> getDashboard(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(dashboardService.getDashboard(userId));
    }

    @PostMapping("/me/consent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PatientConsent> grantConsent(@RequestHeader("X-User-Id") Long userId,
                                                       @RequestBody Map<String, Object> body) {
        String type = (String) body.get("consentType");
        Number to = (Number) body.get("grantedToId");
        PatientConsent c = consentService.grantConsent(userId, type, to != null ? to.longValue() : null, null);
        return ResponseEntity.ok(c);
    }

    @DeleteMapping("/me/consent/{consentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> revokeConsent(@RequestHeader("X-User-Id") Long userId, @PathVariable Long consentId) {
        consentService.revokeConsent(consentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/consent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PatientConsent>> listConsents(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(consentService.listConsents(userId));
    }
}
