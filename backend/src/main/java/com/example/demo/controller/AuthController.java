package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.AuthService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<PersonnelAccountResponseDto> register(@RequestBody PersonnelAccountRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @GetMapping("/personnel")
    @PreAuthorize("hasRole('AGENCY_DIRECTOR')")
    public ResponseEntity<Page<PersonnelAccountResponseDto>> getAllPersonnel(Pageable pageable) {
        return ResponseEntity.ok(authService.getAllPersonnel(pageable));
    }

    @PutMapping("/personnel/{id}")
    @PreAuthorize("hasRole('AGENCY_DIRECTOR')")
    public ResponseEntity<PersonnelAccountResponseDto> updatePersonnel(@PathVariable Long id,
                                                                        @RequestBody PersonnelAccountRequestDto dto) {
        return ResponseEntity.ok(authService.updatePersonnel(id, dto));
    }

    @DeleteMapping("/personnel/{id}")
    @PreAuthorize("hasRole('AGENCY_DIRECTOR')")
    public ResponseEntity<Void> deletePersonnel(@PathVariable Long id) {
        authService.deactivatePersonnel(id);
        return ResponseEntity.noContent().build();
    }
}
