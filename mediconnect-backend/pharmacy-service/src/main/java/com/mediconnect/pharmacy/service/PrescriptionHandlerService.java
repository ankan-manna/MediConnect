package com.mediconnect.pharmacy.service;

import com.mediconnect.pharmacy.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PrescriptionHandlerService {

    private final OrderService orderService;

    @SuppressWarnings("unchecked")
    @Transactional
    public void handlePrescriptionCreated(Map<String, Object> payload) {
        String prescriptionId = (String) payload.get("prescriptionId");
        Number patientUserId = (Number) payload.get("patientUserId");
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        if (items == null) items = new ArrayList<>();
        // Drug interaction flagging placeholder - would call external API or rules engine
        orderService.createOrderFromPrescription(patientUserId != null ? patientUserId.longValue() : 0L, prescriptionId, items);
    }
}
