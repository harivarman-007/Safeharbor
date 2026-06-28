package com.example.demo.service;

import com.example.demo.dto.DisasterIncidentRequestDto;
import com.example.demo.dto.DisasterIncidentResponseDto;
import com.example.demo.entity.DisasterIncident;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DisasterIncidentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class IncidentCoordinationService {

    private final DisasterIncidentRepository incidentRepository;

    public IncidentCoordinationService(DisasterIncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
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

    public Page<DisasterIncidentResponseDto> getAllIncidents(Pageable pageable) {
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

    public void deleteIncident(Long id) {
        if (!incidentRepository.existsById(id)) {
            throw new ResourceNotFoundException("DisasterIncident not found: " + id);
        }
        incidentRepository.deleteById(id);
    }

    public DisasterIncidentResponseDto updateStatus(Long id, String status) {
        DisasterIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterIncident not found: " + id));
        incident.setStatus(status);
        return toResponseDto(incidentRepository.save(incident));
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
