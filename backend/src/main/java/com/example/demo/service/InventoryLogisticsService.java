package com.example.demo.service;

import com.example.demo.dto.SupplyInventoryRequestDto;
import com.example.demo.dto.SupplyInventoryResponseDto;
import com.example.demo.entity.SupplyInventory;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SupplyInventoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryLogisticsService {

    private final SupplyInventoryRepository inventoryRepository;

    public InventoryLogisticsService(SupplyInventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public SupplyInventoryResponseDto addItem(SupplyInventoryRequestDto dto) {
        SupplyInventory item = SupplyInventory.builder()
                .itemName(dto.getItemName())
                .category(dto.getCategory())
                .availableQuantity(dto.getAvailableQuantity() != null ? dto.getAvailableQuantity() : 0)
                .criticalThreshold(dto.getCriticalThreshold() != null ? dto.getCriticalThreshold() : 100)
                .unit(dto.getUnit())
                .build();
        return toResponseDto(inventoryRepository.save(item));
    }

    public Page<SupplyInventoryResponseDto> getAllItems(Pageable pageable) {
        return inventoryRepository.findAll(pageable).map(this::toResponseDto);
    }

    public SupplyInventoryResponseDto updateStock(Long id, Integer quantity) {
        SupplyInventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + id));
        item.setAvailableQuantity(quantity);
        return toResponseDto(inventoryRepository.save(item));
    }

    public SupplyInventoryResponseDto updateItem(Long id, SupplyInventoryRequestDto dto) {
        SupplyInventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + id));
        if (dto.getItemName() != null) item.setItemName(dto.getItemName());
        if (dto.getCategory() != null) item.setCategory(dto.getCategory());
        if (dto.getAvailableQuantity() != null) item.setAvailableQuantity(dto.getAvailableQuantity());
        if (dto.getCriticalThreshold() != null) item.setCriticalThreshold(dto.getCriticalThreshold());
        if (dto.getUnit() != null) item.setUnit(dto.getUnit());
        return toResponseDto(inventoryRepository.save(item));
    }

    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    public List<SupplyInventoryResponseDto> getShortages() {
        return inventoryRepository.findShortages().stream().map(this::toResponseDto).toList();
    }

    private SupplyInventoryResponseDto toResponseDto(SupplyInventory i) {
        return SupplyInventoryResponseDto.builder()
                .id(i.getId())
                .itemName(i.getItemName())
                .category(i.getCategory())
                .availableQuantity(i.getAvailableQuantity())
                .reservedQuantity(i.getReservedQuantity())
                .criticalThreshold(i.getCriticalThreshold())
                .unit(i.getUnit())
                .build();
    }
}
