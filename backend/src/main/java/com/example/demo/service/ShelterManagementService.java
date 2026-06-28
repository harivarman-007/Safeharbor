package com.example.demo.service;

import com.example.demo.dto.ReliefShelterRequestDto;
import com.example.demo.dto.ReliefShelterResponseDto;
import com.example.demo.entity.ReliefShelter;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ReliefShelterRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ShelterManagementService {

    private final ReliefShelterRepository shelterRepository;

    public ShelterManagementService(ReliefShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public ReliefShelterResponseDto registerShelter(ReliefShelterRequestDto dto) {
        ReliefShelter shelter = ReliefShelter.builder()
                .shelterName(dto.getShelterName())
                .locationAddress(dto.getLocationAddress())
                .capacity(dto.getCapacity())
                .managerName(dto.getManagerName())
                .currentOccupancy(0)
                .isActive(true)
                .build();
        return toResponseDto(shelterRepository.save(shelter));
    }

    public Page<ReliefShelterResponseDto> getAllShelters(Pageable pageable) {
        return shelterRepository.findAll(pageable).map(this::toResponseDto);
    }

    public ReliefShelterResponseDto updateShelter(Long id, ReliefShelterRequestDto dto) {
        ReliefShelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found: " + id));
        if (dto.getShelterName() != null) shelter.setShelterName(dto.getShelterName());
        if (dto.getLocationAddress() != null) shelter.setLocationAddress(dto.getLocationAddress());
        if (dto.getCapacity() != null) shelter.setCapacity(dto.getCapacity());
        if (dto.getManagerName() != null) shelter.setManagerName(dto.getManagerName());
        return toResponseDto(shelterRepository.save(shelter));
    }

    public void deleteShelter(Long id) {
        if (!shelterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shelter not found: " + id);
        }
        shelterRepository.deleteById(id);
    }

    public ReliefShelterResponseDto adjustOccupancy(Long id, Integer intakeCount) {
        ReliefShelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found: " + id));
        int newOccupancy = shelter.getCurrentOccupancy() + intakeCount;
        if (newOccupancy < 0) throw new BusinessValidationException("Occupancy cannot go below 0.");
        if (newOccupancy > shelter.getCapacity()) throw new BusinessValidationException("Occupancy exceeds shelter capacity.");
        shelter.setCurrentOccupancy(newOccupancy);
        return toResponseDto(shelterRepository.save(shelter));
    }

    private ReliefShelterResponseDto toResponseDto(ReliefShelter s) {
        return ReliefShelterResponseDto.builder()
                .id(s.getId())
                .shelterName(s.getShelterName())
                .locationAddress(s.getLocationAddress())
                .capacity(s.getCapacity())
                .currentOccupancy(s.getCurrentOccupancy())
                .managerName(s.getManagerName())
                .isActive(s.isActive())
                .build();
    }
}
