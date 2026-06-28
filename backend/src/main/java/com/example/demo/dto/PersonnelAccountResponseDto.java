package com.example.demo.dto;

public class PersonnelAccountResponseDto {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String contactNumber;
    private String assignedRegion;
    private boolean isActive;

    public PersonnelAccountResponseDto() {}

    public PersonnelAccountResponseDto(Long id, String username, String fullName, String role, String contactNumber, String assignedRegion, boolean isActive) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.contactNumber = contactNumber;
        this.assignedRegion = assignedRegion;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAssignedRegion() { return assignedRegion; }
    public void setAssignedRegion(String assignedRegion) { this.assignedRegion = assignedRegion; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String username;
        private String fullName;
        private String role;
        private String contactNumber;
        private String assignedRegion;
        private boolean isActive;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public Builder assignedRegion(String assignedRegion) { this.assignedRegion = assignedRegion; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public PersonnelAccountResponseDto build() {
            return new PersonnelAccountResponseDto(id, username, fullName, role, contactNumber, assignedRegion, isActive);
        }
    }
}
