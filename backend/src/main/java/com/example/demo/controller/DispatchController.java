package com.example.demo.controller;

import com.example.demo.dto.ResourceDispatchRequestDto;
import com.example.demo.dto.ResourceDispatchResponseDto;
import com.example.demo.service.DispatchOrchestrationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dispatches")
public class DispatchController {

    private final DispatchOrchestrationService dispatchService;

    public DispatchController(DispatchOrchestrationService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping("/request")
    public ResponseEntity<ResourceDispatchResponseDto> requestDispatch(@Valid @RequestBody ResourceDispatchRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dispatchService.requestDispatch(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ResourceDispatchResponseDto>> getAllDispatches(Pageable pageable) {
        return ResponseEntity.ok(dispatchService.getAllDispatches(pageable));
    }

    @PostMapping("/{id}/fulfill")
    @PreAuthorize("hasAnyRole('AGENCY_DIRECTOR', 'LOGISTICS_COORDINATOR')")
    public ResponseEntity<ResourceDispatchResponseDto> fulfillDispatch(@PathVariable Long id) {
        return ResponseEntity.ok(dispatchService.fulfillDispatch(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDispatch(@PathVariable Long id) {
        dispatchService.deleteDispatch(id);
        return ResponseEntity.noContent().build();
    }
}
