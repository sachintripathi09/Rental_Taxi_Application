package com.rentaltaxi.config;

import com.rentaltaxi.entity.Admin;
import com.rentaltaxi.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final AdminRepository adminRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        adminRepo.findByUsername("master_admin").ifPresent(adminRepo::delete);
        
        Admin superAdmin = new Admin();
        superAdmin.setUsername("master_admin");
        superAdmin.setPassword(passwordEncoder.encode("Master@123"));
        superAdmin.setEmail("admin@rentaltaxi.com");
        superAdmin.setFullName("System Master Admin");
        superAdmin.setPhone("9999999999");
        
        adminRepo.save(superAdmin);
        
        System.out.println("============================================");
        System.out.println(">>> SUCCESS: Forced SYSTEM ADMIN seeding!");
        System.out.println(">>> Username: master_admin");
        System.out.println(">>> Password: Master@123");
        System.out.println("============================================");
    }
}