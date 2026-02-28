package com.mediconnect.auth.repository;

import com.mediconnect.auth.entity.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {

    List<LoginAudit> findByUserIdOrderByLoginTimeDesc(Long userId, org.springframework.data.domain.Pageable pageable);

    long countByUserIdAndLoginTimeAfter(Long userId, Instant after);
}
