package com.example.demo;

import com.example.demo.entity.DisasterIncident;
import com.example.demo.entity.PersonnelAccount;
import com.example.demo.entity.ResourceDispatch;
import com.example.demo.entity.SupplyInventory;
import com.example.demo.repository.DisasterIncidentRepository;
import com.example.demo.repository.PersonnelAccountRepository;
import com.example.demo.repository.ResourceDispatchRepository;
import com.example.demo.repository.SupplyInventoryRepository;
import com.example.demo.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for SafeHarbor SRS audit items.
 * Runs against H2 in-memory database (no MySQL required).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SafeHarborIntegrationTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtService jwtService;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired PersonnelAccountRepository personnelRepo;
    @Autowired SupplyInventoryRepository inventoryRepo;
    @Autowired DisasterIncidentRepository incidentRepo;
    @Autowired ResourceDispatchRepository dispatchRepo;

    private String directorToken;
    private String responderToken;
    private String deactivatedToken;

    @BeforeEach
    void setUp() {
        // Director account
        PersonnelAccount director = PersonnelAccount.builder()
                .username("director@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .fullName("Dir Test")
                .role("AGENCY_DIRECTOR")
                .contactNumber("0000000000")
                .assignedRegion("HQ")
                .isActive(true)
                .build();
        personnelRepo.save(director);
        directorToken = mintToken("director@test.com", "AGENCY_DIRECTOR");

        // Field responder account (limited role)
        PersonnelAccount responder = PersonnelAccount.builder()
                .username("responder@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .fullName("Resp Test")
                .role("FIELD_RESPONDER")
                .contactNumber("1111111111")
                .assignedRegion("Zone A")
                .isActive(true)
                .build();
        personnelRepo.save(responder);
        responderToken = mintToken("responder@test.com", "FIELD_RESPONDER");

        // Deactivated account
        PersonnelAccount deactivated = PersonnelAccount.builder()
                .username("deactivated@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .fullName("Dead Test")
                .role("FIELD_RESPONDER")
                .contactNumber("2222222222")
                .assignedRegion("Zone B")
                .isActive(false)
                .build();
        personnelRepo.save(deactivated);
        deactivatedToken = mintToken("deactivated@test.com", "FIELD_RESPONDER");
    }

    // -----------------------------------------------------------------------
    // Test 1: FIELD_RESPONDER gets 403 on POST /api/inventory
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T1 – FIELD_RESPONDER is forbidden from POST /api/inventory")
    void fieldResponder_cannotPostInventory() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "itemName", "WaterBottles",
                "category", "WATER",
                "availableQuantity", 100,
                "reservedQuantity", 0,
                "criticalThreshold", 20,
                "unit", "litres"
        ));
        mockMvc.perform(post("/api/inventory")
                        .header("Authorization", "Bearer " + responderToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // -----------------------------------------------------------------------
    // Test 2: FIELD_RESPONDER gets 403 on POST /api/shelters
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T2 – FIELD_RESPONDER is forbidden from POST /api/shelters")
    void fieldResponder_cannotPostShelter() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "shelterName", "Shelter A",
                "locationAddress", "123 Main St",
                "capacity", 200,
                "currentOccupancy", 0,
                "managerName", "Manager One"
        ));
        mockMvc.perform(post("/api/shelters")
                        .header("Authorization", "Bearer " + responderToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // -----------------------------------------------------------------------
    // Test 3: FIELD_RESPONDER gets 403 on PATCH /api/shelters/{id}/occupancy
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T3 – FIELD_RESPONDER is forbidden from PATCH /api/shelters/{id}/occupancy")
    void fieldResponder_cannotPatchOccupancy() throws Exception {
        mockMvc.perform(patch("/api/shelters/1/occupancy")
                        .param("intakeCount", "10")
                        .header("Authorization", "Bearer " + responderToken))
                .andExpect(status().isForbidden());
    }

    // -----------------------------------------------------------------------
    // Test 4: JWT token contains a "role" claim
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T4 – JWT token contains a role claim")
    void jwtToken_containsRoleClaim() throws Exception {
        // Call login and inspect the returned token
        String loginBody = objectMapper.writeValueAsString(
                Map.of("username", "director@test.com", "password", "pass"));

        String responseJson = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(responseJson).get("accessToken").asText();
        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
        assertThat(role).isEqualTo("AGENCY_DIRECTOR");
    }

    // -----------------------------------------------------------------------
    // Test 5: Deactivated user gets 403 on login
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T5 – Deactivated account gets 403 on login")
    void deactivatedUser_gets403OnLogin() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("username", "deactivated@test.com", "password", "pass"));
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // -----------------------------------------------------------------------
    // Test 6: Dispatch on a RESOLVED incident returns 400
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T6 – Dispatch on RESOLVED incident returns 400")
    void dispatch_onResolvedIncident_returns400() throws Exception {
        // Create a RESOLVED incident
        DisasterIncident incident = DisasterIncident.builder()
                .title("Old Flood")
                .description("All clear")
                .incidentType("FLOOD")
                .severityLevel("LOW")
                .latitude(13.0)
                .longitude(80.0)
                .status("RESOLVED")
                .build();
        incident = incidentRepo.save(incident);

        // Create inventory with enough stock
        SupplyInventory inv = SupplyInventory.builder()
                .itemName("MedKit-T6")
                .category("MEDICAL")
                .availableQuantity(500)
                .reservedQuantity(0)
                .criticalThreshold(50)
                .unit("kits")
                .build();
        inv = inventoryRepo.save(inv);

        String body = objectMapper.writeValueAsString(Map.of(
                "targetIncidentId", incident.getId(),
                "inventoryItemId", inv.getId(),
                "dispatchedQuantity", 10
        ));

        mockMvc.perform(post("/api/dispatches/request")
                        .header("Authorization", "Bearer " + directorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    // -----------------------------------------------------------------------
    // Test 7: PUT /api/dispatches/{id} moves stock correctly
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T7 – PUT /api/dispatches/{id} adjusts stock correctly")
    void putDispatch_adjustsStockCorrectly() throws Exception {
        // Seed incident + inventory + an existing dispatch
        DisasterIncident incident = incidentRepo.save(DisasterIncident.builder()
                .title("Flood T7").description("Active").incidentType("FLOOD")
                .severityLevel("HIGH").latitude(13.0).longitude(80.0).status("ASSIGNED").build());

        SupplyInventory inv = inventoryRepo.save(SupplyInventory.builder()
                .itemName("Blankets-T7").category("SUPPLIES")
                .availableQuantity(200).reservedQuantity(50)
                .criticalThreshold(20).unit("pieces").build());

        ResourceDispatch existing = ResourceDispatch.builder()
                .targetIncident(incident)
                .inventory(inv)
                .dispatchedQuantity(50)
                .dispatchStatus("IN_TRANSIT")
                .build();
        existing = dispatchRepo.save(existing);

        // Update: change quantity from 50 → 30 (release 20 back to available)
        String body = objectMapper.writeValueAsString(Map.of(
                "targetIncidentId", incident.getId(),
                "inventoryItemId", inv.getId(),
                "dispatchedQuantity", 30
        ));

        mockMvc.perform(put("/api/dispatches/" + existing.getId())
                        .header("Authorization", "Bearer " + directorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dispatchedQuantity").value(30));

        SupplyInventory updated = inventoryRepo.findById(inv.getId()).orElseThrow();
        // availableQuantity should have increased by 20 (50→30 delta), reservedQuantity decreased by 20
        assertThat(updated.getAvailableQuantity()).isEqualTo(220);
        assertThat(updated.getReservedQuantity()).isEqualTo(30);
    }

    // -----------------------------------------------------------------------
    // Test 8: Duplicate item name returns 409
    // -----------------------------------------------------------------------
    @Test
    @DisplayName("T8 – Duplicate inventory item name returns 409")
    void duplicateItemName_returns409() throws Exception {
        // Pre-seed an item
        inventoryRepo.save(SupplyInventory.builder()
                .itemName("DuplicateItem")
                .category("FOOD")
                .availableQuantity(100)
                .reservedQuantity(0)
                .criticalThreshold(10)
                .unit("kg")
                .build());

        // Try to insert again with same name
        String body = objectMapper.writeValueAsString(Map.of(
                "itemName", "DuplicateItem",
                "category", "FOOD",
                "availableQuantity", 50,
                "reservedQuantity", 0,
                "criticalThreshold", 5,
                "unit", "kg"
        ));

        mockMvc.perform(post("/api/inventory")
                        .header("Authorization", "Bearer " + directorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    // -----------------------------------------------------------------------
    // Helper
    // -----------------------------------------------------------------------
    private String mintToken(String username, String role) {
        User userDetails = new User(username, "irrelevant",
                List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        return jwtService.generateToken(Map.of("role", role), userDetails);
    }
}
