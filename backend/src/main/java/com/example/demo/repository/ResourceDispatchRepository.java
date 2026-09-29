package com.example.demo.repository;

import com.example.demo.entity.ResourceDispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceDispatchRepository extends JpaRepository<ResourceDispatch, Long> {
    List<ResourceDispatch> findByDispatchStatus(String dispatchStatus);
    List<ResourceDispatch> findByTargetIncidentId(Long incidentId);
}
