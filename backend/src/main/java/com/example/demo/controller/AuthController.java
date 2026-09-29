package com.example.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.PersonnelAccountRequestDto;
import com.example.demo.dto.PersonnelAccountResponseDto;
import com.example.demo.service.AuthService;

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
    public ResponseEntity<Page<PersonnelAccountResponseDto>> getAllPersonnel(
            @RequestParam(required = false) String role,
            Pageable pageable) {
        return ResponseEntity.ok(authService.getAllPersonnel(role, pageable));
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
