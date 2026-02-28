package com.mediconnect.pharmacy.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory", indexes = @Index(name = "idx_medicine_sku", columnList = "medicine_sku", unique = true))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medicine_sku", nullable = false, unique = true)
    private String medicineSku;

    private String medicineName;
    private Integer quantity;
    private String unit;
    private Double pricePerUnit;
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void prePersist() {
        updatedAt = Instant.now();
    }
}
