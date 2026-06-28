package com.example.demo.controller;

import com.example.demo.dto.SupplyInventoryRequestDto;
import com.example.demo.dto.SupplyInventoryResponseDto;
import com.example.demo.service.InventoryLogisticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryLogisticsService inventoryService;

    public InventoryController(InventoryLogisticsService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ResponseEntity<SupplyInventoryResponseDto> addItem(@RequestBody SupplyInventoryRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.addItem(dto));
    }

    @GetMapping
    public ResponseEntity<Page<SupplyInventoryResponseDto>> getAllItems(Pageable pageable) {
        return ResponseEntity.ok(inventoryService.getAllItems(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplyInventoryResponseDto> updateItem(@PathVariable Long id,
                                                                  @RequestBody SupplyInventoryRequestDto dto) {
        return ResponseEntity.ok(inventoryService.updateItem(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shortages")
    public ResponseEntity<List<SupplyInventoryResponseDto>> getShortages() {
        return ResponseEntity.ok(inventoryService.getShortages());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<SupplyInventoryResponseDto> updateStock(@PathVariable Long id,
                                                                   @RequestParam Integer quantity) {
        return ResponseEntity.ok(inventoryService.updateStock(id, quantity));
    }
}
