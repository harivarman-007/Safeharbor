package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_incidents")
public class DisasterIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "incident_type", nullable = false)
    private String incidentType;

    @Column(name = "severity_level", nullable = false)
    private String severityLevel;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String status = "REPORTED";

    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_responder_id")
    private PersonnelAccount assignedResponder;

    @PrePersist
    public void prePersist() {
        this.reportedAt = LocalDateTime.now();
        if (this.status == null) this.status = "REPORTED";
    }

    // Constructors
    public DisasterIncident() {}

    public DisasterIncident(Long id, String title, String description, String incidentType, String severityLevel, Double latitude, Double longitude, String status, LocalDateTime reportedAt, PersonnelAccount assignedResponder) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.incidentType = incidentType;
        this.severityLevel = severityLevel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status != null ? status : "REPORTED";
        this.reportedAt = reportedAt;
        this.assignedResponder = assignedResponder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIncidentType() { return incidentType; }
    public void setIncidentType(String incidentType) { this.incidentType = incidentType; }

    public String getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(String severityLevel) { this.severityLevel = severityLevel; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public PersonnelAccount getAssignedResponder() { return assignedResponder; }
    public void setAssignedResponder(PersonnelAccount assignedResponder) { this.assignedResponder = assignedResponder; }

    // Builder
    public static DisasterIncidentBuilder builder() {
        return new DisasterIncidentBuilder();
    }

    public static class DisasterIncidentBuilder {
        private Long id;
        private String title;
        private String description;
        private String incidentType;
        private String severityLevel;
        private Double latitude;
        private Double longitude;
        private String status = "REPORTED";
        private LocalDateTime reportedAt;
        private PersonnelAccount assignedResponder;

        public DisasterIncidentBuilder id(Long id) { this.id = id; return this; }
        public DisasterIncidentBuilder title(String title) { this.title = title; return this; }
        public DisasterIncidentBuilder description(String description) { this.description = description; return this; }
        public DisasterIncidentBuilder incidentType(String incidentType) { this.incidentType = incidentType; return this; }
        public DisasterIncidentBuilder severityLevel(String severityLevel) { this.severityLevel = severityLevel; return this; }
        public DisasterIncidentBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public DisasterIncidentBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public DisasterIncidentBuilder status(String status) { this.status = status; return this; }
        public DisasterIncidentBuilder reportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; return this; }
        public DisasterIncidentBuilder assignedResponder(PersonnelAccount assignedResponder) { this.assignedResponder = assignedResponder; return this; }

        public DisasterIncident build() {
            return new DisasterIncident(id, title, description, incidentType, severityLevel, latitude, longitude, status, reportedAt, assignedResponder);
        }
    }
}
