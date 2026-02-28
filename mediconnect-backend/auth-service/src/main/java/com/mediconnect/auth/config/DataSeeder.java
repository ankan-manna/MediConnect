package com.mediconnect.auth.config;

import com.mediconnect.auth.entity.Role;
import com.mediconnect.auth.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
    }

    private void seedRoles() {
        String[] roleNames = {"PATIENT", "DOCTOR", "PHARMACIST", "LAB_TECH", "ADMIN"};
        for (String name : roleNames) {
            if (!roleRepository.findByName(name).isPresent()) {
                Role r = new Role();
                r.setName(name);
                roleRepository.save(r);
            }
        }
    }
}
