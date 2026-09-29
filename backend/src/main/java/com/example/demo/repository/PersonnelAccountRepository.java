package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.PersonnelAccount;

public interface PersonnelAccountRepository extends JpaRepository<PersonnelAccount, Long> {
    Optional<PersonnelAccount> findByUsername(String username);
    boolean existsByUsername(String username);
    Page<PersonnelAccount> findByRoleAndIsActiveTrue(String role, Pageable pageable);
}
