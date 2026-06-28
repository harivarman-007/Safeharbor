package com.example.demo.service;

import com.example.demo.dto.ResourceDispatchRequestDto;
import com.example.demo.dto.ResourceDispatchResponseDto;
import com.example.demo.entity.DisasterIncident;
import com.example.demo.entity.ResourceDispatch;
import com.example.demo.entity.SupplyInventory;
import com.example.demo.event.DispatchFulfilledEvent;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DisasterIncidentRepository;
import com.example.demo.repository.ResourceDispatchRepository;
import com.example.demo.repository.SupplyInventoryRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DispatchOrchestrationService {

    private final ResourceDispatchRepository dispatchRepository;
    private final DisasterIncidentRepository incidentRepository;
    private final SupplyInventoryRepository inventoryRepository;
    private final ApplicationEventPublisher eventPublisher;

    public DispatchOrchestrationService(ResourceDispatchRepository dispatchRepository,
                                        DisasterIncidentRepository incidentRepository,
                                        SupplyInventoryRepository inventoryRepository,
                                        ApplicationEventPublisher eventPublisher) {
        this.dispatchRepository = dispatchRepository;
        this.incidentRepository = incidentRepository;
        this.inventoryRepository = inventoryRepository;
        this.eventPublisher = eventPublisher;
    }

    public ResourceDispatchResponseDto requestDispatch(ResourceDispatchRequestDto dto) {
        DisasterIncident incident = incidentRepository.findById(dto.getTargetIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + dto.getTargetIncidentId()));
        SupplyInventory inventory = inventoryRepository.findById(dto.getInventoryItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + dto.getInventoryItemId()));

        if (inventory.getAvailableQuantity() < dto.getDispatchedQuantity()) {
            throw new BusinessValidationException("Insufficient inventory: available=" + inventory.getAvailableQuantity()
                    + ", requested=" + dto.getDispatchedQuantity());
        }

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - dto.getDispatchedQuantity());
        inventory.setReservedQuantity(inventory.getReservedQuantity() + dto.getDispatchedQuantity());
        inventoryRepository.save(inventory);

        ResourceDispatch dispatch = ResourceDispatch.builder()
                .targetIncident(incident)
                .inventory(inventory)
                .dispatchedQuantity(dto.getDispatchedQuantity())
                .dispatchStatus("PENDING_APPROVAL")
                .build();

        return toResponseDto(dispatchRepository.save(dispatch));
    }

    public Page<ResourceDispatchResponseDto> getAllDispatches(Pageable pageable) {
        return dispatchRepository.findAll(pageable).map(this::toResponseDto);
    }

    public ResourceDispatchResponseDto fulfillDispatch(Long id) {
        ResourceDispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found: " + id));
        dispatch.setDispatchStatus("IN_TRANSIT");
        ResourceDispatch saved = dispatchRepository.save(dispatch);

        eventPublisher.publishEvent(new DispatchFulfilledEvent(this,
                saved.getId(),
                saved.getInventory().getItemName(),
                saved.getTargetIncident().getTitle()));

        return toResponseDto(saved);
    }

    public void deleteDispatch(Long id) {
        if (!dispatchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dispatch not found: " + id);
        }
        dispatchRepository.deleteById(id);
    }

    private ResourceDispatchResponseDto toResponseDto(ResourceDispatch d) {
        return ResourceDispatchResponseDto.builder()
                .id(d.getId())
                .incidentTitle(d.getTargetIncident().getTitle())
                .itemName(d.getInventory().getItemName())
                .dispatchedQuantity(d.getDispatchedQuantity())
                .dispatchStatus(d.getDispatchStatus())
                .initiatedAt(d.getInitiatedAt())
                .build();
    }
}
