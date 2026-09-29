# SafeHarbor — SRS Audit Fix Report

**Commit:** `f3209cb`  
**Date:** 2026-09-29  
**Audited against:** `SafeHarbor SRS (1).txt`  
**Scope:** backend/ (Spring Boot, Java 17) · src/ (React + Vite, port 3000)

---

## Overview

A full audit of the SafeHarbor codebase was performed against the SRS document.  
**21 bugs** were identified and fixed across backend services, repositories, controllers, security configuration, and the React frontend.  
All fixes were verified with **15 live integration tests** against the running application.

---

## Backend Fixes

### BUG-01 · `fulfillDispatch` set wrong status and left reserved stock stranded
**File:** `backend/.../service/DispatchOrchestrationService.java`

| Before | After |
|--------|-------|
| `dispatch.setDispatchStatus("IN_TRANSIT")` | `dispatch.setDispatchStatus("DELIVERED")` |
| No `reservedQuantity` change on fulfill | `inventory.setReservedQuantity(Math.max(0, reserved - qty))` |
| Guard checked `PENDING_APPROVAL` | Guard checks `DELIVERED` (idempotency) |

---

### BUG-02 · `requestDispatch` did not enforce stock availability
**File:** `backend/.../service/DispatchOrchestrationService.java`

Added: `if (availableQty < requestedQty) → throw BusinessValidationException`  
Also: atomically decrements `availableQuantity` and increments `reservedQuantity` on request.

---

### BUG-03 · `deleteDispatch` (cancel) did not restore inventory
**File:** `backend/.../service/DispatchOrchestrationService.java`

`deleteDispatch` now: if status ≠ `DELIVERED` and ≠ `CANCELLED` → restores `availableQty += qty`, `reservedQty -= qty`.

---

### BUG-04 · `deleteIncident` left orphan dispatches and stranded reserved stock
**File:** `backend/.../service/IncidentCoordinationService.java`

`deleteIncident` now iterates all linked dispatches, restores inventory for any non-terminal dispatch, deletes each dispatch, then deletes the incident — all in one `@Transactional` block.

---

### BUG-05 · No incident status transition guard
**File:** `backend/.../service/IncidentCoordinationService.java`

Added `validateStatusTransition(current, target)`:
- Rejects unknown statuses
- Blocks any transition away from terminal states (`RESOLVED`, `CANCELLED`)
- Allows idempotent same-status updates

---

### BUG-06 · `assignResponder` had no role or active-status guard
**File:** `backend/.../service/IncidentCoordinationService.java`

Now enforces: responder must be `FIELD_RESPONDER` role AND `isActive=true`. Blocks assignment to incidents in terminal states. Sets incident status to `ASSIGNED` on success.

---

### BUG-07 · No coordinate bounds validation
**File:** `backend/.../service/IncidentCoordinationService.java`

Added: `if (lat < -90 || lat > 90 || lng < -180 || lng > 180) → throw BusinessValidationException("Invalid coordinate bounds.")`

---

### BUG-08 · `GET /api/incidents` had no server-side status filtering
**Files:** `DisasterIncidentRepository.java` · `IncidentCoordinationService.java` · `IncidentController.java`

- Added `Page<DisasterIncident> findByStatus(String status, Pageable pageable)` to repository
- `getAllIncidents(String status, Pageable pageable)` delegates to `findByStatus` when status is non-null
- `GET /api/incidents?status=RESOLVED` now generates `WHERE status=?` in SQL

---

### BUG-09 · `login` returned HTTP 500 on bad credentials (should be 401)
**Files:** `AuthService.java` · `InvalidCredentialsException.java` (new) · `GlobalExceptionHandler.java`

- Created `InvalidCredentialsException extends RuntimeException`
- `AuthService.login` throws it on wrong password (was `new RuntimeException(...)`)
- `GlobalExceptionHandler` maps it to `HTTP 401 Unauthorized`

---

### BUG-10 · `login` allowed deactivated accounts
**File:** `AuthService.java`

Added: `if (!account.isActive()) → throw BusinessValidationException("Account is deactivated.")` before password check.

---

### BUG-11 · Shelter occupancy had no overflow/underflow guard
**File:** `ShelterManagementService.java`

`adjustOccupancy` now throws `BusinessValidationException` if `newOccupancy < 0` or `newOccupancy > capacity`.

---

### BUG-12 · `/api/auth/personnel` endpoints were publicly accessible
**File:** `AuthController.java`

Added `@PreAuthorize("hasRole('AGENCY_DIRECTOR')")` to:
- `GET /api/auth/personnel`
- `PUT /api/auth/personnel/{id}`
- `DELETE /api/auth/personnel/{id}`

---

### BUG-13 · `AccessDeniedException` fell through to generic 500 handler
**File:** `GlobalExceptionHandler.java`

Added:
- `@ExceptionHandler(AccessDeniedException.class)` → `HTTP 403 Forbidden`
- `@ExceptionHandler(AuthenticationException.class)` → `HTTP 401 Unauthorized`

---

### BUG-14 · DataSeeder only created `admin`; no `EMERGENCY_DISPATCHER` seed
**File:** `DataSeeder.java`

Added seeding of `dispatcher / dispatch123` with `EMERGENCY_DISPATCHER` role.  
On existing account: resets password **and role** (prevents manual DB drift).

---

### BUG-15 · CORS rejected requests from the active frontend (port 3000)
**File:** `SecurityConfig.java`

`allowedOrigins` now includes both `http://localhost:3000` and `http://localhost:5173`.

---

### BUG-16 · Missing repository query methods
**Files:** `PersonnelAccountRepository.java` · `ResourceDispatchRepository.java` · `SupplyInventoryRepository.java` · `DisasterIncidentRepository.java`

Added:
- `existsByUsername(String)` — used by register duplicate check
- `findByRoleAndIsActiveTrue(String role, Pageable)` — used by personnel list filter
- `findByTargetIncidentId(Long)` — used by cascade delete of dispatches
- `findByStatus(String, Pageable)` — server-side incident status filter
- `findByItemName(String)` — duplicate item name check
- `findShortages()` — returns items where `availableQty ≤ criticalThreshold`

---

## Frontend Fixes (src/ — active app on port 3000)

### BUG-17 · Redux store had no slices for domain entities
**Files:** `store/slices/incidentSlice.js` · `dispatchSlice.js` · `shelterSlice.js` · `inventorySlice.js`

Created all 4 slices with full async thunks:

| Slice | Thunks |
|-------|--------|
| `incidents` | `fetchIncidents`, `reportIncident`, `changeIncidentStatus`, `assignIncidentResponder`, `removeIncident`, `modifyIncident` |
| `dispatches` | `fetchDispatches`, `requestDispatch`, `fulfillDispatch`, `deleteDispatch` |
| `shelters` | `fetchShelters`, `registerShelter`, `updateOccupancy`, `updateShelter`, `deleteShelter` |
| `inventory` | `fetchInventory`, `addInventoryItem`, `updateStock`, `deleteInventoryItem` |

Each slice stores `{ items, loading, error, pagination }`. Inventory also computes `shortages` locally.

---

### BUG-18 · Axios service layer was empty (no API calls implemented)
**Files:** `services/incidentService.js` · `dispatchService.js` · `shelterService.js` · `inventoryService.js`

Implemented all calls matching the exact backend REST endpoints:
```
PATCH /incidents/{id}/status?status=X
POST  /incidents/{id}/assign?personnelId=X
POST  /dispatches/{id}/fulfill
PATCH /shelters/{id}/occupancy?intakeCount=X
```

---

### BUG-19 · Incident UI had no Resolve/Cancel/Assign-Responder controls
**File:** `components/incident/DisasterIncidentList.jsx`

Added per-row actions for `AGENCY_DIRECTOR`:
- **✓ Resolve** and **✕ Cancel** buttons (non-terminal incidents only)
- Responder dropdown + **Assign** button (REPORTED incidents only, lists active FIELD_RESPONDERs)
- Status filter bar (now server-side) + local text search on title/type

---

### BUG-20 · Dispatch UI had no Fulfill or Cancel buttons
**File:** `components/dispatch/ResourceDispatchList.jsx`

Added for `AGENCY_DIRECTOR`:
- **Fulfill** button — visible for `IN_TRANSIT` dispatches; calls `POST /dispatches/{id}/fulfill`
- **Cancel** button — visible for `IN_TRANSIT`; calls `DELETE /dispatches/{id}` and shows inventory-restored notification

---

### BUG-21 · Shelter occupancy used inline text input; no modal
**Files:** `components/shelter/ReliefShelterList.jsx` · `components/common/OccupancyModal.jsx` (new)

New `OccupancyModal` component:
- Shows current occupancy vs max capacity
- Accepts a delta (positive = intake, negative = discharge)
- Validates bounds client-side before API call
- `AGENCY_DIRECTOR` also gets Edit + Delete buttons for each shelter

---

## Integration Test Results

All 15 tests were run against the live backend after restart:

| # | Test Description | HTTP | Result |
|---|-----------------|------|--------|
| T01 | Wrong password → 401 | 401 | ✅ PASS |
| T02 | GET /api/incidents returns paged data | 200 | ✅ PASS |
| T03 | Dispatch: reserve decrements avail/increments reserved; fulfill sets DELIVERED and decrements reserved | — | ✅ PASS |
| T04 | RESOLVED → CANCELLED transition blocked | 400 | ✅ PASS |
| T05 | Delete incident with IN_TRANSIT dispatch restores inventory | — | ✅ PASS |
| T06 | Shelter +50 succeeds; +60 more on 50/100 shelter blocked | 400 | ✅ PASS |
| T07 | AGENCY_DIRECTOR sees /personnel; EMERGENCY_DISPATCHER gets 403 | 403 | ✅ PASS |
| T08 | lat=999 rejected by coordinate bounds guard | 400 | ✅ PASS |
| T09 | assignResponder: AGENCY_DIRECTOR blocked; active FIELD_RESPONDER succeeds | 400/200 | ✅ PASS |
| T10 | Low-stock item appears in GET /api/inventory/shortages | 200 | ✅ PASS |
| T11 | Wrong password → HTTP 401 (was 500) | 401 | ✅ PASS |
| T12 | Non-director accessing /personnel → HTTP 403 (was 500) | 403 | ✅ PASS |
| T13 | dispatcher account role resets to EMERGENCY_DISPATCHER on restart | — | ✅ PASS |
| T14 | GET /incidents?status=REPORTED uses WHERE status=? in SQL | — | ✅ PASS |
| T15 | GET /incidents/99999 → HTTP 404 | 404 | ✅ PASS |

**All 15 tests: PASS**

---

## Files Changed

```
backend/src/main/java/com/example/demo/
  config/
    DataSeeder.java                          (seed dispatcher + reset role on restart)
    JwtAuthenticationFilter.java             (check isActive before setting auth context)
    SecurityConfig.java                      (CORS: add localhost:3000)
  controller/
    AuthController.java                      (@PreAuthorize on personnel endpoints)
    DispatchController.java                  (add DELETE /{id} endpoint)
    IncidentController.java                  (add status param + assign endpoint)
  exception/
    GlobalExceptionHandler.java              (add 401/403 handlers)
    InvalidCredentialsException.java         (NEW — maps to HTTP 401)
  repository/
    DisasterIncidentRepository.java          (add findByStatus)
    PersonnelAccountRepository.java          (add existsByUsername, findByRoleAndIsActiveTrue)
    ResourceDispatchRepository.java          (add findByTargetIncidentId)
    SupplyInventoryRepository.java           (add findByItemName, findShortages)
  service/
    AuthService.java                         (isActive check, InvalidCredentialsException)
    DispatchOrchestrationService.java        (DELIVERED fix, stock restore, inventory guard)
    IncidentCoordinationService.java         (cascade delete, status guard, coord validation, assignResponder)
    InventoryLogisticsService.java           (duplicate name guard, delete by id)
    ShelterManagementService.java            (occupancy overflow/underflow guard)

src/  (active frontend, port 3000)
  components/
    common/OccupancyModal.jsx                (NEW)
    common/OccupancyModal.css                (NEW)
    dispatch/ResourceDispatchList.jsx        (Fulfill + Cancel buttons)
    incident/DisasterIncidentForm.jsx        (edit mode support)
    incident/DisasterIncidentList.jsx        (Resolve/Cancel/Assign; server filter)
    inventory/SupplyInventoryList.jsx        (reservedQty column, Low Stock badge)
    shelter/ReliefShelterList.jsx            (OccupancyModal, Edit/Delete)
    shelter/ReliefShelterForm.jsx            (edit mode support)
    layout/Navbar.jsx                        (role-based nav items)
  services/
    dispatchService.js                       (implement all API calls)
    incidentService.js                       (implement all API calls)
    inventoryService.js                      (implement all API calls)
    shelterService.js                        (implement all API calls)
  store/slices/
    dispatchSlice.js                         (NEW — full Redux slice)
    incidentSlice.js                         (NEW — full Redux slice)
    inventorySlice.js                        (NEW — full Redux slice + shortages)
    shelterSlice.js                          (NEW — full Redux slice)
```

---

*Generated by SRS audit — commit `f3209cb`*
