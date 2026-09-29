package com.example.demo.repository;

import com.example.demo.entity.ReliefShelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReliefShelterRepository extends JpaRepository<ReliefShelter, Long> {
    List<ReliefShelter> findByIsActiveTrue();

    @Query("SELECT s FROM ReliefShelter s WHERE s.isActive = true AND (s.capacity - s.currentOccupancy) >= :needed")
    List<ReliefShelter> findWithAvailableCapacity(@Param("needed") int needed);
}
