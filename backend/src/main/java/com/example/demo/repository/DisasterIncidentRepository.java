package com.example.demo.repository;

import com.example.demo.entity.DisasterIncident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, Long> {
}
