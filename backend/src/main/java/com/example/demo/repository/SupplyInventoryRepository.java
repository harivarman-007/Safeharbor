package com.example.demo.repository;

import com.example.demo.entity.SupplyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface SupplyInventoryRepository extends JpaRepository<SupplyInventory, Long> {

    Optional<SupplyInventory> findByItemName(String itemName);

    default List<SupplyInventory> findShortages() {
        return findAll().stream()
            .filter(i -> i.getAvailableQuantity() <= i.getCriticalThreshold())
            .toList();
    }
}
