package com.example.demo.repository;

import com.example.demo.entity.SupplyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplyInventoryRepository extends JpaRepository<SupplyInventory, Long> {

    default List<SupplyInventory> findShortages() {
        return findAll().stream()
            .filter(i -> i.getAvailableQuantity() <= i.getCriticalThreshold())
            .toList();
    }
}
