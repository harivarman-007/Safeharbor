package com.example.demo.repository;

import com.example.demo.entity.DisasterIncident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, Long> {
    Page<DisasterIncident> findByStatus(String status, Pageable pageable);

    Page<DisasterIncident> findByStatusNot(String status, Pageable pageable);

    @Query("SELECT d FROM DisasterIncident d WHERE d.severityLevel IN ('CRITICAL', 'HIGH') AND d.assignedResponder IS NULL AND d.status = 'REPORTED'")
    List<DisasterIncident> findCriticalUnassigned();
}
