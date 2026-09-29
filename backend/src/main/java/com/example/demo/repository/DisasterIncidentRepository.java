package com.example.demo.repository;

import com.example.demo.entity.DisasterIncident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, Long> {
    Page<DisasterIncident> findByStatus(String status, Pageable pageable);
}
