package com.example.demo.dto;

public class SupplyInventoryRequestDto {
    private String itemName;
    private String category;
    private Integer availableQuantity;
    private Integer criticalThreshold;
    private String unit;

    public SupplyInventoryRequestDto() {}

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Integer getCriticalThreshold() { return criticalThreshold; }
    public void setCriticalThreshold(Integer criticalThreshold) { this.criticalThreshold = criticalThreshold; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
