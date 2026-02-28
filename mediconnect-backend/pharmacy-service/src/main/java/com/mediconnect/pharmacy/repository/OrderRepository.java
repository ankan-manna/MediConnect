package com.mediconnect.pharmacy.repository;

import com.mediconnect.pharmacy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId, org.springframework.data.domain.Pageable pageable);
}
