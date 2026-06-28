package com.example.demo.dto;

public class SupplyInventoryResponseDto {
    private Long id;
    private String itemName;
    private String category;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Integer criticalThreshold;
    private String unit;

    public SupplyInventoryResponseDto() {}

    public SupplyInventoryResponseDto(Long id, String itemName, String category, Integer availableQuantity, Integer reservedQuantity, Integer criticalThreshold, String unit) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.availableQuantity = availableQuantity;
        this.reservedQuantity = reservedQuantity;
        this.criticalThreshold = criticalThreshold;
        this.unit = unit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Integer getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(Integer reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public Integer getCriticalThreshold() { return criticalThreshold; }
    public void setCriticalThreshold(Integer criticalThreshold) { this.criticalThreshold = criticalThreshold; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String itemName;
        private String category;
        private Integer availableQuantity;
        private Integer reservedQuantity;
        private Integer criticalThreshold;
        private String unit;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder itemName(String itemName) { this.itemName = itemName; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder availableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; return this; }
        public Builder reservedQuantity(Integer reservedQuantity) { this.reservedQuantity = reservedQuantity; return this; }
        public Builder criticalThreshold(Integer criticalThreshold) { this.criticalThreshold = criticalThreshold; return this; }
        public Builder unit(String unit) { this.unit = unit; return this; }

        public SupplyInventoryResponseDto build() {
            return new SupplyInventoryResponseDto(id, itemName, category, availableQuantity, reservedQuantity, criticalThreshold, unit);
        }
    }
}
