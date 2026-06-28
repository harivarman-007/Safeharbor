package com.example.demo.controller;

import com.example.demo.dto.DisasterIncidentRequestDto;
import com.example.demo.dto.DisasterIncidentResponseDto;
import com.example.demo.service.IncidentCoordinationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentCoordinationService incidentService;

    public IncidentController(IncidentCoordinationService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AGENCY_DIRECTOR', 'EMERGENCY_DISPATCHER')")
    public ResponseEntity<DisasterIncidentResponseDto> reportIncident(@RequestBody DisasterIncidentRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.reportIncident(dto));
    }

    @GetMapping
    public ResponseEntity<Page<DisasterIncidentResponseDto>> getAllIncidents(Pageable pageable) {
        return ResponseEntity.ok(incidentService.getAllIncidents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisasterIncidentResponseDto> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisasterIncidentResponseDto> updateIncident(@PathVariable Long id,
                                                                       @RequestBody DisasterIncidentRequestDto dto) {
        return ResponseEntity.ok(incidentService.updateIncident(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.ok(Map.of("message", "DisasterIncident deleted successfully."));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DisasterIncidentResponseDto> updateStatus(@PathVariable Long id,
                                                                     @RequestParam String status) {
        return ResponseEntity.ok(incidentService.updateStatus(id, status));
    }
}
