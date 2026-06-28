package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class ResourceDispatchRequestDto {
    @NotNull
    private Long targetIncidentId;
    @NotNull
    private Long inventoryItemId;
    @NotNull
    private Integer dispatchedQuantity;

    public ResourceDispatchRequestDto() {}

    public Long getTargetIncidentId() { return targetIncidentId; }
    public void setTargetIncidentId(Long targetIncidentId) { this.targetIncidentId = targetIncidentId; }

    public Long getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }

    public Integer getDispatchedQuantity() { return dispatchedQuantity; }
    public void setDispatchedQuantity(Integer dispatchedQuantity) { this.dispatchedQuantity = dispatchedQuantity; }
}
