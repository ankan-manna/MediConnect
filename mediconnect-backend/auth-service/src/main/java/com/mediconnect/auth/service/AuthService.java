package com.mediconnect.auth.service;

import com.mediconnect.auth.dto.*;
import com.mediconnect.auth.entity.LoginAudit;
import com.mediconnect.auth.entity.Role;
import com.mediconnect.auth.entity.User;
import com.mediconnect.auth.exception.BadRequestException;
import com.mediconnect.auth.exception.UnauthorizedException;
import com.mediconnect.auth.repository.LoginAuditRepository;
import com.mediconnect.auth.repository.RoleRepository;
import com.mediconnect.auth.repository.UserRepository;
import com.mediconnect.auth.security.JwtTokenProvider;
import com.mediconnect.auth.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OtpService otpService;

    @Transactional
    public TokenResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmail(request.getEmailOrPhone())
                .orElseGet(() -> userRepository.findByPhone(request.getEmailOrPhone())
                        .orElse(null));
        if (user == null || !user.getActive()) {
            auditLogin(null, request.getEmailOrPhone(), httpRequest, false);
            throw new UnauthorizedException("Invalid credentials");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            auditLogin(user.getId(), user.getEmail(), httpRequest, true);
            return buildTokenResponse(authentication);
        } catch (Exception e) {
            auditLogin(user.getId(), user.getEmail(), httpRequest, false);
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    public TokenResponse verifyOtpAndLogin(OtpVerifyRequest request, HttpServletRequest httpRequest) {
        if (!otpService.verify(request.getPhoneOrEmail(), request.getOtp())) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }
        User user = userRepository.findByEmail(request.getPhoneOrEmail())
                .orElseGet(() -> userRepository.findByPhone(request.getPhoneOrEmail())
                        .orElseThrow(() -> new BadRequestException("User not found. Please register first.")));
        if (!user.getActive()) throw new UnauthorizedException("Account is disabled");
        java.util.List<String> roles = user.getRoles().stream().map(r -> "ROLE_" + r.getName()).collect(Collectors.toList());
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        auditLogin(user.getId(), user.getEmail(), httpRequest, true);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresInSeconds(tokenProvider.getAccessExpirationMs() / 1000)
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    public void sendOtp(OtpRequest request) {
        String otp = otpService.generateAndStore(request.getPhoneOrEmail());
        // Placeholder: integrate with SMS/email provider
        // if ("sms".equals(request.getChannel())) smsService.send(request.getPhoneOrEmail(), "OTP: " + otp);
        // else emailService.sendOtp(request.getPhoneOrEmail(), otp);
    }

    @Transactional
    public TokenResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        Long userId = tokenProvider.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(userId).orElseThrow(() -> new UnauthorizedException("User not found"));
        java.util.List<String> roles = user.getRoles().stream().map(r -> "ROLE_" + r.getName()).collect(Collectors.toList());
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresInSeconds(tokenProvider.getAccessExpirationMs() / 1000)
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    @Transactional
    public Long register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty() && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone already registered");
        }
        User.UserType type;
        try {
            type = User.UserType.valueOf(request.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid user type");
        }
        Role role = roleRepository.findByName(type.name()).orElseGet(() -> {
            Role r = new Role();
            r.setName(type.name());
            return roleRepository.save(r);
        });
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .userType(type)
                .active(true)
                .roles(new HashSet<>(java.util.Collections.singleton(role)))
                .build();
        user = userRepository.save(user);
        return user.getId();
    }

    public TokenResponse linkAbha(Long userId, String abhaId) {
        if (abhaId == null || abhaId.trim().isEmpty()) {
            throw new BadRequestException("ABHA ID required");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("User not found"));
        user.setAbhaId(abhaId);
        userRepository.save(user);
        java.util.List<String> roles = user.getRoles().stream().map(r -> "ROLE_" + r.getName()).collect(Collectors.toList());
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresInSeconds(tokenProvider.getAccessExpirationMs() / 1000)
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    private TokenResponse buildTokenResponse(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(principal.getId());
        Set<String> roles = principal.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toSet());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresInSeconds(tokenProvider.getAccessExpirationMs() / 1000)
                .roles(roles)
                .userId(principal.getId())
                .email(principal.getEmail())
                .build();
    }

    private void auditLogin(Long userId, String email, HttpServletRequest request, boolean success) {
        LoginAudit audit = LoginAudit.builder()
                .userId(userId != null ? userId : 0L)
                .email(email)
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .success(success)
                .loginTime(Instant.now())
                .build();
        loginAuditRepository.save(audit);
    }
}
