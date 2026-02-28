package com.mediconnect.appointment.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class SlotLockService {

    private static final String LOCK_PREFIX = "slot_lock:";
    private static final long LOCK_TTL_SECONDS = 300; // 5 min to complete booking

    private final RedisTemplate<String, String> redisTemplate;

    public SlotLockService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean tryLock(Long slotId, String requestId) {
        String key = LOCK_PREFIX + slotId;
        Boolean set = redisTemplate.opsForValue().setIfAbsent(key, requestId, LOCK_TTL_SECONDS, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(set);
    }

    public void unlock(Long slotId, String requestId) {
        String key = LOCK_PREFIX + slotId;
        String current = redisTemplate.opsForValue().get(key);
        if (requestId.equals(current)) {
            redisTemplate.delete(key);
        }
    }
}
