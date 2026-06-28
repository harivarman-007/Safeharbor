package com.example.demo.controller;

import com.example.demo.dto.ReliefShelterRequestDto;
import com.example.demo.dto.ReliefShelterResponseDto;
import com.example.demo.service.ShelterManagementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterManagementService shelterService;

    public ShelterController(ShelterManagementService shelterService) {
        this.shelterService = shelterService;
    }

    @PostMapping
    public ResponseEntity<ReliefShelterResponseDto> registerShelter(@RequestBody ReliefShelterRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shelterService.registerShelter(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ReliefShelterResponseDto>> getAllShelters(Pageable pageable) {
        return ResponseEntity.ok(shelterService.getAllShelters(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReliefShelterResponseDto> updateShelter(@PathVariable Long id,
                                                                    @RequestBody ReliefShelterRequestDto dto) {
        return ResponseEntity.ok(shelterService.updateShelter(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/occupancy")
    public ResponseEntity<ReliefShelterResponseDto> adjustOccupancy(@PathVariable Long id,
                                                                      @RequestParam Integer intakeCount) {
        return ResponseEntity.ok(shelterService.adjustOccupancy(id, intakeCount));
    }
}
