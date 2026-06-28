package com.example.demo.dto;

import java.time.LocalDateTime;

public class DisasterIncidentResponseDto {
    private Long id;
    private String title;
    private String description;
    private String incidentType;
    private String severityLevel;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime reportedAt;
    private String assignedResponderUsername;

    public DisasterIncidentResponseDto() {}

    public DisasterIncidentResponseDto(Long id, String title, String description, String incidentType, String severityLevel, Double latitude, Double longitude, String status, LocalDateTime reportedAt, String assignedResponderUsername) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.incidentType = incidentType;
        this.severityLevel = severityLevel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.reportedAt = reportedAt;
        this.assignedResponderUsername = assignedResponderUsername;
    }

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

    public String getAssignedResponderUsername() { return assignedResponderUsername; }
    public void setAssignedResponderUsername(String assignedResponderUsername) { this.assignedResponderUsername = assignedResponderUsername; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private String incidentType;
        private String severityLevel;
        private Double latitude;
        private Double longitude;
        private String status;
        private LocalDateTime reportedAt;
        private String assignedResponderUsername;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder incidentType(String incidentType) { this.incidentType = incidentType; return this; }
        public Builder severityLevel(String severityLevel) { this.severityLevel = severityLevel; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder reportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; return this; }
        public Builder assignedResponderUsername(String assignedResponderUsername) { this.assignedResponderUsername = assignedResponderUsername; return this; }

        public DisasterIncidentResponseDto build() {
            return new DisasterIncidentResponseDto(id, title, description, incidentType, severityLevel, latitude, longitude, status, reportedAt, assignedResponderUsername);
        }
    }
}
