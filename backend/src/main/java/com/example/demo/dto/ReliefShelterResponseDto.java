package com.example.demo.dto;

public class ReliefShelterResponseDto {
    private Long id;
    private String shelterName;
    private String locationAddress;
    private Integer capacity;
    private Integer currentOccupancy;
    private String managerName;
    private boolean isActive;

    public ReliefShelterResponseDto() {}

    public ReliefShelterResponseDto(Long id, String shelterName, String locationAddress, Integer capacity, Integer currentOccupancy, String managerName, boolean isActive) {
        this.id = id;
        this.shelterName = shelterName;
        this.locationAddress = locationAddress;
        this.capacity = capacity;
        this.currentOccupancy = currentOccupancy;
        this.managerName = managerName;
        this.isActive = isActive;
    }

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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String shelterName;
        private String locationAddress;
        private Integer capacity;
        private Integer currentOccupancy;
        private String managerName;
        private boolean isActive;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder shelterName(String shelterName) { this.shelterName = shelterName; return this; }
        public Builder locationAddress(String locationAddress) { this.locationAddress = locationAddress; return this; }
        public Builder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public Builder currentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; return this; }
        public Builder managerName(String managerName) { this.managerName = managerName; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public ReliefShelterResponseDto build() {
            return new ReliefShelterResponseDto(id, shelterName, locationAddress, capacity, currentOccupancy, managerName, isActive);
        }
    }
}
