package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "personnel_accounts")
public class PersonnelAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "assigned_region")
    private String assignedRegion;

    @Column(name = "is_active")
    private boolean isActive = true;

    // Constructors
    public PersonnelAccount() {}

    public PersonnelAccount(Long id, String username, String passwordHash, String fullName, String role, String contactNumber, String assignedRegion, boolean isActive) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.contactNumber = contactNumber;
        this.assignedRegion = assignedRegion;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

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

    // Builder Pattern
    public static PersonnelAccountBuilder builder() {
        return new PersonnelAccountBuilder();
    }

    public static class PersonnelAccountBuilder {
        private Long id;
        private String username;
        private String passwordHash;
        private String fullName;
        private String role;
        private String contactNumber;
        private String assignedRegion;
        private boolean isActive = true;

        public PersonnelAccountBuilder id(Long id) { this.id = id; return this; }
        public PersonnelAccountBuilder username(String username) { this.username = username; return this; }
        public PersonnelAccountBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public PersonnelAccountBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public PersonnelAccountBuilder role(String role) { this.role = role; return this; }
        public PersonnelAccountBuilder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public PersonnelAccountBuilder assignedRegion(String assignedRegion) { this.assignedRegion = assignedRegion; return this; }
        public PersonnelAccountBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public PersonnelAccount build() {
            return new PersonnelAccount(id, username, passwordHash, fullName, role, contactNumber, assignedRegion, isActive);
        }
    }
}
