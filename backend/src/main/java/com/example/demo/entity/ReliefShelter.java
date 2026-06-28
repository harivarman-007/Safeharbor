package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "relief_shelters")
public class ReliefShelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shelter_name", nullable = false)
    private String shelterName;

    @Column(name = "location_address", nullable = false)
    private String locationAddress;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "current_occupancy")
    private Integer currentOccupancy = 0;

    @Column(name = "manager_name")
    private String managerName;

    @Column(name = "is_active")
    private boolean isActive = true;

    // Constructors
    public ReliefShelter() {}

    public ReliefShelter(Long id, String shelterName, String locationAddress, Integer capacity, Integer currentOccupancy, String managerName, boolean isActive) {
        this.id = id;
        this.shelterName = shelterName;
        this.locationAddress = locationAddress;
        this.capacity = capacity;
        this.currentOccupancy = currentOccupancy != null ? currentOccupancy : 0;
        this.managerName = managerName;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }

    // Builder
    public static ReliefShelterBuilder builder() {
        return new ReliefShelterBuilder();
    }

    public static class ReliefShelterBuilder {
        private Long id;
        private String shelterName;
        private String locationAddress;
        private Integer capacity;
        private Integer currentOccupancy = 0;
        private String managerName;
        private boolean isActive = true;

        public ReliefShelterBuilder id(Long id) { this.id = id; return this; }
        public ReliefShelterBuilder shelterName(String shelterName) { this.shelterName = shelterName; return this; }
        public ReliefShelterBuilder locationAddress(String locationAddress) { this.locationAddress = locationAddress; return this; }
        public ReliefShelterBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public ReliefShelterBuilder currentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; return this; }
        public ReliefShelterBuilder managerName(String managerName) { this.managerName = managerName; return this; }
        public ReliefShelterBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public ReliefShelter build() {
            return new ReliefShelter(id, shelterName, locationAddress, capacity, currentOccupancy, managerName, isActive);
        }
    }
}
