package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_dispatches")
public class ResourceDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_incident_id", nullable = false)
    private DisasterIncident targetIncident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private SupplyInventory inventory;

    @Column(name = "dispatched_quantity", nullable = false)
    private Integer dispatchedQuantity;

    @Column(name = "dispatch_status", nullable = false)
    private String dispatchStatus = "PENDING_APPROVAL";

    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @PrePersist
    public void prePersist() {
        this.initiatedAt = LocalDateTime.now();
        if (this.dispatchStatus == null) this.dispatchStatus = "PENDING_APPROVAL";
    }

    // Constructors
    public ResourceDispatch() {}

    public ResourceDispatch(Long id, DisasterIncident targetIncident, SupplyInventory inventory, Integer dispatchedQuantity, String dispatchStatus, LocalDateTime initiatedAt) {
        this.id = id;
        this.targetIncident = targetIncident;
        this.inventory = inventory;
        this.dispatchedQuantity = dispatchedQuantity;
        this.dispatchStatus = dispatchStatus != null ? dispatchStatus : "PENDING_APPROVAL";
        this.initiatedAt = initiatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DisasterIncident getTargetIncident() { return targetIncident; }
    public void setTargetIncident(DisasterIncident targetIncident) { this.targetIncident = targetIncident; }

    public SupplyInventory getInventory() { return inventory; }
    public void setInventory(SupplyInventory inventory) { this.inventory = inventory; }

    public Integer getDispatchedQuantity() { return dispatchedQuantity; }
    public void setDispatchedQuantity(Integer dispatchedQuantity) { this.dispatchedQuantity = dispatchedQuantity; }

    public String getDispatchStatus() { return dispatchStatus; }
    public void setDispatchStatus(String dispatchStatus) { this.dispatchStatus = dispatchStatus; }

    public LocalDateTime getInitiatedAt() { return initiatedAt; }
    public void setInitiatedAt(LocalDateTime initiatedAt) { this.initiatedAt = initiatedAt; }

    // Builder
    public static ResourceDispatchBuilder builder() {
        return new ResourceDispatchBuilder();
    }

    public static class ResourceDispatchBuilder {
        private Long id;
        private DisasterIncident targetIncident;
        private SupplyInventory inventory;
        private Integer dispatchedQuantity;
        private String dispatchStatus = "PENDING_APPROVAL";
        private LocalDateTime initiatedAt;

        public ResourceDispatchBuilder id(Long id) { this.id = id; return this; }
        public ResourceDispatchBuilder targetIncident(DisasterIncident targetIncident) { this.targetIncident = targetIncident; return this; }
        public ResourceDispatchBuilder inventory(SupplyInventory inventory) { this.inventory = inventory; return this; }
        public ResourceDispatchBuilder dispatchedQuantity(Integer dispatchedQuantity) { this.dispatchedQuantity = dispatchedQuantity; return this; }
        public ResourceDispatchBuilder dispatchStatus(String dispatchStatus) { this.dispatchStatus = dispatchStatus; return this; }
        public ResourceDispatchBuilder initiatedAt(LocalDateTime initiatedAt) { this.initiatedAt = initiatedAt; return this; }

        public ResourceDispatch build() {
            return new ResourceDispatch(id, targetIncident, inventory, dispatchedQuantity, dispatchStatus, initiatedAt);
        }
    }
}
