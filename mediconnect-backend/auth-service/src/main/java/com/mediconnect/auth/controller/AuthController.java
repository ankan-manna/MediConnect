package com.mediconnect.auth.controller;

import com.mediconnect.auth.dto.*;
import com.mediconnect.auth.security.UserPrincipal;
import com.mediconnect.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest req) {
        return ResponseEntity.ok(authService.login(request, req));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Long>> register(@Valid @RequestBody RegisterRequest request) {
        Long id = authService.register(request);
        return ResponseEntity.ok(Collections.singletonMap("userId", id));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<Void> sendOtp(@Valid @RequestBody OtpRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<TokenResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request, HttpServletRequest req) {
        return ResponseEntity.ok(authService.verifyOtpAndLogin(request, req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/abha/link")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TokenResponse> linkAbha(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody Map<String, String> body) {
        String abhaId = body.get("abhaId");
        if (abhaId == null || abhaId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.linkAbha(principal.getId(), abhaId));
    }
}
