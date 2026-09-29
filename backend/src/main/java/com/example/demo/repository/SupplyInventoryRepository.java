package com.example.demo.repository;

import com.example.demo.entity.SupplyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

import java.util.Optional;

public interface SupplyInventoryRepository extends JpaRepository<SupplyInventory, Long> {

    Optional<SupplyInventory> findByItemName(String itemName);

    @Query("SELECT s FROM SupplyInventory s WHERE s.availableQuantity <= s.criticalThreshold")
    List<SupplyInventory> findItemsBelowCriticalThreshold();

    default List<SupplyInventory> findShortages() {
        return findItemsBelowCriticalThreshold();
    }
}
