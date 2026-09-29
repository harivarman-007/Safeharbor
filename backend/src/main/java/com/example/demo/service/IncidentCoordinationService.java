package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DisasterIncidentRequestDto;
import com.example.demo.dto.DisasterIncidentResponseDto;
import com.example.demo.entity.DisasterIncident;
import com.example.demo.entity.PersonnelAccount;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DisasterIncidentRepository;
import com.example.demo.repository.PersonnelAccountRepository;
import com.example.demo.repository.ResourceDispatchRepository;
import com.example.demo.repository.SupplyInventoryRepository;
import com.example.demo.entity.ResourceDispatch;
import com.example.demo.entity.SupplyInventory;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class IncidentCoordinationService {

    private final DisasterIncidentRepository incidentRepository;
    private final PersonnelAccountRepository personnelAccountRepository;
    private final ResourceDispatchRepository resourceDispatchRepository;
    private final SupplyInventoryRepository inventoryRepository;

    public IncidentCoordinationService(DisasterIncidentRepository incidentRepository,
                                       PersonnelAccountRepository personnelAccountRepository,
                                       ResourceDispatchRepository resourceDispatchRepository,
                                       SupplyInventoryRepository inventoryRepository) {
        this.incidentRepository = incidentRepository;
        this.personnelAccountRepository = personnelAccountRepository;
        this.resourceDispatchRepository = resourceDispatchRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public DisasterIncidentResponseDto reportNewIncident(DisasterIncidentRequestDto dto) {
        return reportIncident(dto);
    }

    public DisasterIncidentResponseDto reportIncident(DisasterIncidentRequestDto dto) {
        if (dto.getLatitude() < -90 || dto.getLatitude() > 90 || dto.getLongitude() < -180 || dto.getLongitude() > 180) {
            throw new BusinessValidationException("Invalid coordinate bounds.");
        }
        DisasterIncident incident = DisasterIncident.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .incidentType(dto.getIncidentType())
                .severityLevel(dto.getSeverityLevel())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status("REPORTED")
                .build();
        return toResponseDto(incidentRepository.save(incident));
    }

    public Page<DisasterIncidentResponseDto> getPaginatedIncidents(Pageable pageable) {
        return getAllIncidents(null, pageable);
    }

    public Page<DisasterIncidentResponseDto> getAllIncidents(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return incidentRepository.findByStatus(status, pageable).map(this::toResponseDto);
        }
        return incidentRepository.findAll(pageable).map(this::toResponseDto);
    }

    public DisasterIncidentResponseDto getIncidentById(Long id) {
        return toResponseDto(incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + id)));
    }

    public DisasterIncidentResponseDto updateIncident(Long id, DisasterIncidentRequestDto dto) {
        DisasterIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + id));
        if (dto.getTitle() != null) incident.setTitle(dto.getTitle());
        if (dto.getDescription() != null) incident.setDescription(dto.getDescription());
        if (dto.getIncidentType() != null) incident.setIncidentType(dto.getIncidentType());
        if (dto.getSeverityLevel() != null) incident.setSeverityLevel(dto.getSeverityLevel());
        if (dto.getLatitude() != null) incident.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) incident.setLongitude(dto.getLongitude());
        return toResponseDto(incidentRepository.save(incident));
    }

    @Transactional
    public void deleteIncident(Long id) {
        DisasterIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + id));

        List<ResourceDispatch> dispatches = resourceDispatchRepository.findByTargetIncidentId(id);
        for (ResourceDispatch dispatch : dispatches) {
            if (!"DELIVERED".equals(dispatch.getDispatchStatus()) && !"CANCELLED".equals(dispatch.getDispatchStatus())) {
                SupplyInventory inventory = dispatch.getInventory();
                int qty = dispatch.getDispatchedQuantity();
                inventory.setAvailableQuantity(inventory.getAvailableQuantity() + qty);
                inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - qty));
                inventoryRepository.save(inventory);
            }
            resourceDispatchRepository.delete(dispatch);
        }

        incidentRepository.delete(incident);
    }

    @Transactional
    public void updateIncidentStatus(Long id, String status) {
        updateStatus(id, status);
    }

    @Transactional
    public DisasterIncidentResponseDto updateStatus(Long id, String status) {
        DisasterIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + id));

        validateStatusTransition(incident.getStatus(), status);

        incident.setStatus(status);
        return toResponseDto(incidentRepository.save(incident));
    }

    @Transactional
    public DisasterIncidentResponseDto assignResponder(Long incidentId, Long personnelId) {
        DisasterIncident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + incidentId));
        if ("RESOLVED".equals(incident.getStatus()) || "CANCELLED".equals(incident.getStatus())) {
            throw new BusinessValidationException("Cannot assign responder to incident with terminal status: " + incident.getStatus());
        }
        PersonnelAccount responder = personnelAccountRepository.findById(personnelId)
                .orElseThrow(() -> new ResourceNotFoundException("Responder not found: " + personnelId));
        if (!"FIELD_RESPONDER".equals(responder.getRole()) || !responder.isActive()) {
            throw new BusinessValidationException("Responder must be an active FIELD_RESPONDER.");
        }
        incident.setAssignedResponder(responder);
        incident.setStatus("ASSIGNED");
        return toResponseDto(incidentRepository.save(incident));
    }

    private void validateStatusTransition(String currentStatus, String targetStatus) {
        if (targetStatus == null || (!targetStatus.equals("REPORTED") && !targetStatus.equals("ASSIGNED")
                && !targetStatus.equals("RESOLVED") && !targetStatus.equals("CANCELLED"))) {
            throw new BusinessValidationException("Invalid incident status: " + targetStatus);
        }
        if (currentStatus.equals(targetStatus)) {
            return;
        }
        if ("RESOLVED".equals(currentStatus) || "CANCELLED".equals(currentStatus)) {
            throw new BusinessValidationException("Cannot transition incident from terminal status " + currentStatus + " to " + targetStatus);
        }
    }

    private DisasterIncidentResponseDto toResponseDto(DisasterIncident i) {
        return DisasterIncidentResponseDto.builder()
                .id(i.getId())
                .title(i.getTitle())
                .description(i.getDescription())
                .incidentType(i.getIncidentType())
                .severityLevel(i.getSeverityLevel())
                .latitude(i.getLatitude())
                .longitude(i.getLongitude())
                .status(i.getStatus())
                .reportedAt(i.getReportedAt())
                .assignedResponderUsername(i.getAssignedResponder() != null ? i.getAssignedResponder().getUsername() : null)
                .build();
    }
}
