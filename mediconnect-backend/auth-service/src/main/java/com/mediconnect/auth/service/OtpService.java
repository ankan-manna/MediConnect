package com.mediconnect.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_LENGTH = 6;

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${app.otp.ttl-minutes:5}")
    private int otpTtlMinutes;

    public OtpService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateAndStore(String phoneOrEmail) {
        String otp = String.format("%06d", (int) (Math.random() * 1_000_000));
        String key = OTP_PREFIX + phoneOrEmail;
        redisTemplate.opsForValue().set(key, otp, otpTtlMinutes, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verify(String phoneOrEmail, String otp) {
        String key = OTP_PREFIX + phoneOrEmail;
        Object stored = redisTemplate.opsForValue().get(key);
        if (stored == null) return false;
        boolean valid = otp.equals(stored.toString());
        if (valid) redisTemplate.delete(key);
        return valid;
    }

    public void invalidate(String phoneOrEmail) {
        redisTemplate.delete(OTP_PREFIX + phoneOrEmail);
    }
}
