package com.mediconnect.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "login_audit", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_login_time", columnList = "login_time")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String email;
    private String ipAddress;
    private String userAgent;
    private Boolean success;

    @Column(name = "login_time", nullable = false, updatable = false)
    private Instant loginTime;

    @PrePersist
    void prePersist() {
        if (loginTime == null) loginTime = Instant.now();
    }
}
