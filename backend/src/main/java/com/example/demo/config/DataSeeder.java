package com.example.demo.config;

import com.example.demo.entity.PersonnelAccount;
import com.example.demo.repository.PersonnelAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final PersonnelAccountRepository personnelAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(PersonnelAccountRepository personnelAccountRepository, PasswordEncoder passwordEncoder) {
        this.personnelAccountRepository = personnelAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!personnelAccountRepository.existsByUsername("admin")) {
            PersonnelAccount admin = PersonnelAccount.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("Agency Director")
                    .role("AGENCY_DIRECTOR")
                    .contactNumber("+1234567890")
                    .assignedRegion("HQ")
                    .isActive(true)
                    .build();
            personnelAccountRepository.save(admin);
            log.info("[DataSeeder] Default admin account created: username=admin, password=admin123");
        }

        if (!personnelAccountRepository.existsByUsername("dispatcher")) {
            PersonnelAccount dispatcher = PersonnelAccount.builder()
                    .username("dispatcher")
                    .passwordHash(passwordEncoder.encode("dispatch123"))
                    .fullName("Emergency Dispatcher")
                    .role("EMERGENCY_DISPATCHER")
                    .contactNumber("+0987654321")
                    .assignedRegion("Region-1")
                    .isActive(true)
                    .build();
            personnelAccountRepository.save(dispatcher);
            log.info("[DataSeeder] Default dispatcher account created.");
        }
    }
}
