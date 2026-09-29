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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ResourceDispatchResponseDto requestDispatch(ResourceDispatchRequestDto dto) {
        DisasterIncident incident = incidentRepository.findById(dto.getTargetIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + dto.getTargetIncidentId()));

        if ("RESOLVED".equals(incident.getStatus()) || "CANCELLED".equals(incident.getStatus())) {
            throw new BusinessValidationException("Cannot dispatch resources to incident with terminal status: " + incident.getStatus());
        }

        SupplyInventory inventory = inventoryRepository.findById(dto.getInventoryItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + dto.getInventoryItemId()));

        if (inventory.getAvailableQuantity() < dto.getDispatchedQuantity()) {
            throw new BusinessValidationException("Insufficient inventory: available=" + inventory.getAvailableQuantity()
                    + ", requested=" + dto.getDispatchedQuantity());
        }

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - dto.getDispatchedQuantity());
        inventory.setReservedQuantity(inventory.getReservedQuantity() + dto.getDispatchedQuantity());
        inventoryRepository.save(inventory);

        incident.setStatus("ASSIGNED");
        incidentRepository.save(incident);

        ResourceDispatch dispatch = ResourceDispatch.builder()
                .targetIncident(incident)
                .inventory(inventory)
                .dispatchedQuantity(dto.getDispatchedQuantity())
                // PENDING_APPROVAL is a reserved status and unused; dispatches transition directly to IN_TRANSIT upon request.
                .dispatchStatus("IN_TRANSIT")
                .build();

        return toResponseDto(dispatchRepository.save(dispatch));
    }

    public Page<ResourceDispatchResponseDto> getAllDispatches(Pageable pageable) {
        return dispatchRepository.findAll(pageable).map(this::toResponseDto);
    }

    public Page<ResourceDispatchResponseDto> getPaginatedDispatches(Pageable pageable) {
        return getAllDispatches(pageable);
    }

    @Transactional
    public ResourceDispatchResponseDto fulfillDispatch(Long id) {
        ResourceDispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found: " + id));

        if ("DELIVERED".equals(dispatch.getDispatchStatus())) {
            throw new BusinessValidationException("Dispatch is already delivered.");
        }

        dispatch.setDispatchStatus("DELIVERED");

        SupplyInventory inventory = dispatch.getInventory();
        int qty = dispatch.getDispatchedQuantity();
        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - qty));
        inventoryRepository.save(inventory);

        ResourceDispatch saved = dispatchRepository.save(dispatch);

        eventPublisher.publishEvent(new DispatchFulfilledEvent(this,
                saved.getId(),
                saved.getInventory().getItemName(),
                saved.getTargetIncident().getTitle()));

        return toResponseDto(saved);
    }

    @Transactional
    public void deleteDispatch(Long id) {
        ResourceDispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found: " + id));

        if (!"DELIVERED".equals(dispatch.getDispatchStatus()) && !"CANCELLED".equals(dispatch.getDispatchStatus())) {
            SupplyInventory inventory = dispatch.getInventory();
            int qty = dispatch.getDispatchedQuantity();
            inventory.setAvailableQuantity(inventory.getAvailableQuantity() + qty);
            inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - qty));
            inventoryRepository.save(inventory);
        }

        dispatchRepository.delete(dispatch);
    }

    @Transactional
    public ResourceDispatchResponseDto updateDispatch(Long id, ResourceDispatchRequestDto dto) {
        Integer newQuantity = dto.getDispatchedQuantity();
        if (newQuantity == null || newQuantity <= 0) {
            throw new BusinessValidationException("Dispatched quantity must be greater than 0.");
        }
        return updateDispatch(id, newQuantity);
    }

    @Transactional
    public ResourceDispatchResponseDto updateDispatch(Long id, Integer newQuantity) {
        if (newQuantity == null || newQuantity <= 0) {
            throw new BusinessValidationException("Dispatched quantity must be greater than 0.");
        }
        ResourceDispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found: " + id));

        if (!"IN_TRANSIT".equals(dispatch.getDispatchStatus())) {
            throw new BusinessValidationException("Only IN_TRANSIT dispatches can be updated.");
        }

        int diff = newQuantity - dispatch.getDispatchedQuantity();
        SupplyInventory inventory = dispatch.getInventory();

        if (diff > 0) {
            if (inventory.getAvailableQuantity() < diff) {
                throw new BusinessValidationException("Insufficient inventory to increase dispatch quantity.");
            }
            inventory.setAvailableQuantity(inventory.getAvailableQuantity() - diff);
            inventory.setReservedQuantity(inventory.getReservedQuantity() + diff);
        } else if (diff < 0) {
            int releaseQty = -diff;
            inventory.setAvailableQuantity(inventory.getAvailableQuantity() + releaseQty);
            inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - releaseQty));
        }

        inventoryRepository.save(inventory);
        dispatch.setDispatchedQuantity(newQuantity);
        return toResponseDto(dispatchRepository.save(dispatch));
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
