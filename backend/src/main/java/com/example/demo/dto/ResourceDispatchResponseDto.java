package com.example.demo.dto;

import java.time.LocalDateTime;

public class ResourceDispatchResponseDto {
    private Long id;
    private String incidentTitle;
    private String itemName;
    private Integer dispatchedQuantity;
    private String dispatchStatus;
    private LocalDateTime initiatedAt;

    public ResourceDispatchResponseDto() {}

    public ResourceDispatchResponseDto(Long id, String incidentTitle, String itemName, Integer dispatchedQuantity, String dispatchStatus, LocalDateTime initiatedAt) {
        this.id = id;
        this.incidentTitle = incidentTitle;
        this.itemName = itemName;
        this.dispatchedQuantity = dispatchedQuantity;
        this.dispatchStatus = dispatchStatus;
        this.initiatedAt = initiatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIncidentTitle() { return incidentTitle; }
    public void setIncidentTitle(String incidentTitle) { this.incidentTitle = incidentTitle; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Integer getDispatchedQuantity() { return dispatchedQuantity; }
    public void setDispatchedQuantity(Integer dispatchedQuantity) { this.dispatchedQuantity = dispatchedQuantity; }

    public String getDispatchStatus() { return dispatchStatus; }
    public void setDispatchStatus(String dispatchStatus) { this.dispatchStatus = dispatchStatus; }

    public LocalDateTime getInitiatedAt() { return initiatedAt; }
    public void setInitiatedAt(LocalDateTime initiatedAt) { this.initiatedAt = initiatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String incidentTitle;
        private String itemName;
        private Integer dispatchedQuantity;
        private String dispatchStatus;
        private LocalDateTime initiatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder incidentTitle(String incidentTitle) { this.incidentTitle = incidentTitle; return this; }
        public Builder itemName(String itemName) { this.itemName = itemName; return this; }
        public Builder dispatchedQuantity(Integer dispatchedQuantity) { this.dispatchedQuantity = dispatchedQuantity; return this; }
        public Builder dispatchStatus(String dispatchStatus) { this.dispatchStatus = dispatchStatus; return this; }
        public Builder initiatedAt(LocalDateTime initiatedAt) { this.initiatedAt = initiatedAt; return this; }

        public ResourceDispatchResponseDto build() {
            return new ResourceDispatchResponseDto(id, incidentTitle, itemName, dispatchedQuantity, dispatchStatus, initiatedAt);
        }
    }
}
