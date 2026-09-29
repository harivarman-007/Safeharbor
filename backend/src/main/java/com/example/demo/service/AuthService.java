package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.PersonnelAccountRequestDto;
import com.example.demo.dto.PersonnelAccountResponseDto;
import com.example.demo.entity.PersonnelAccount;
import com.example.demo.exception.AccountDeactivatedException;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.InvalidCredentialsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PersonnelAccountRepository;
import java.util.Map;

@Service
public class AuthService {

    private final PersonnelAccountRepository personnelAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(PersonnelAccountRepository personnelAccountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.personnelAccountRepository = personnelAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public PersonnelAccountResponseDto register(PersonnelAccountRequestDto dto) {
        if (personnelAccountRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessValidationException("Username already exists: " + dto.getUsername());
        }
        PersonnelAccount account = PersonnelAccount.builder()
                .username(dto.getUsername())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .role(dto.getRole() != null ? dto.getRole() : "FIELD_RESPONDER")
                .contactNumber(dto.getContactNumber())
                .assignedRegion(dto.getAssignedRegion())
                .isActive(true)
                .build();
        PersonnelAccount saved = personnelAccountRepository.save(account);
        return toResponseDto(saved);
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        PersonnelAccount account = personnelAccountRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getUsername()));

        if (!account.isActive()) {
            throw new AccountDeactivatedException("Account is deactivated.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), account.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password.");
        }

        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(
                        account.getUsername(), account.getPasswordHash(),
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + account.getRole()))
                );

        String token = jwtService.generateToken(Map.of("role", account.getRole()), userDetails);

        return AuthResponseDto.builder()
                .accessToken(token)
                .refreshToken(token)
                .username(account.getUsername())
                .role(account.getRole())
                .fullName(account.getFullName())
                .build();
    }

    public AuthResponseDto registerPersonnel(PersonnelAccountRequestDto dto) {
        PersonnelAccountResponseDto reg = register(dto);
        return login(new AuthRequestDto(dto.getUsername(), dto.getPassword()));
    }

    public AuthResponseDto authenticatePersonnel(AuthRequestDto dto) {
        return login(dto);
    }

    public Page<PersonnelAccountResponseDto> getPaginatedAccounts(Pageable pageable) {
        return getAllPersonnel(null, pageable);
    }

    public Page<PersonnelAccountResponseDto> getAllPersonnel(String role, Pageable pageable) {
        if (role != null && !role.isBlank()) {
            return personnelAccountRepository.findByRoleAndIsActiveTrue(role, pageable)
                    .map(this::toResponseDto);
        }
        return personnelAccountRepository.findAll(pageable).map(this::toResponseDto);
    }

    public PersonnelAccountResponseDto updatePersonnel(Long id, PersonnelAccountRequestDto dto) {
        PersonnelAccount account = personnelAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel not found: " + id));
        if (dto.getFullName() != null) account.setFullName(dto.getFullName());
        if (dto.getRole() != null) account.setRole(dto.getRole());
        if (dto.getContactNumber() != null) account.setContactNumber(dto.getContactNumber());
        if (dto.getAssignedRegion() != null) account.setAssignedRegion(dto.getAssignedRegion());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            account.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }
        return toResponseDto(personnelAccountRepository.save(account));
    }

    public void deactivatePersonnel(Long id) {
        PersonnelAccount account = personnelAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel not found: " + id));
        account.setActive(false);
        personnelAccountRepository.save(account);
    }

    private PersonnelAccountResponseDto toResponseDto(PersonnelAccount account) {
        return PersonnelAccountResponseDto.builder()
                .id(account.getId())
                .username(account.getUsername())
                .fullName(account.getFullName())
                .role(account.getRole())
                .contactNumber(account.getContactNumber())
                .assignedRegion(account.getAssignedRegion())
                .isActive(account.isActive())
                .build();
    }
}
