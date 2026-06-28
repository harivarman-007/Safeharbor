package com.example.demo.repository;

import com.example.demo.entity.PersonnelAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersonnelAccountRepository extends JpaRepository<PersonnelAccount, Long> {
    Optional<PersonnelAccount> findByUsername(String username);
    boolean existsByUsername(String username);
}
