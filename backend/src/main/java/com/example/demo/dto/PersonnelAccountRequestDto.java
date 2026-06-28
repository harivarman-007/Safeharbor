package com.example.demo.dto;

public class PersonnelAccountRequestDto {
    private String username;
    private String password;
    private String fullName;
    private String role;
    private String contactNumber;
    private String assignedRegion;

    public PersonnelAccountRequestDto() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAssignedRegion() { return assignedRegion; }
    public void setAssignedRegion(String assignedRegion) { this.assignedRegion = assignedRegion; }
}
