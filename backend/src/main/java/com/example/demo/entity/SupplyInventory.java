package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "supply_inventories")
public class SupplyInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", unique = true, nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String category;

    @Column(name = "available_quantity")
    private Integer availableQuantity = 0;

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;

    @Column(name = "critical_threshold")
    private Integer criticalThreshold = 100;

    @Column(nullable = false)
    private String unit;

    // Constructors
    public SupplyInventory() {}

    public SupplyInventory(Long id, String itemName, String category, Integer availableQuantity, Integer reservedQuantity, Integer criticalThreshold, String unit) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.availableQuantity = availableQuantity != null ? availableQuantity : 0;
        this.reservedQuantity = reservedQuantity != null ? reservedQuantity : 0;
        this.criticalThreshold = criticalThreshold != null ? criticalThreshold : 100;
        this.unit = unit;
    }

    // Getters and Setters
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

    // Builder
    public static SupplyInventoryBuilder builder() {
        return new SupplyInventoryBuilder();
    }

    public static class SupplyInventoryBuilder {
        private Long id;
        private String itemName;
        private String category;
        private Integer availableQuantity = 0;
        private Integer reservedQuantity = 0;
        private Integer criticalThreshold = 100;
        private String unit;

        public SupplyInventoryBuilder id(Long id) { this.id = id; return this; }
        public SupplyInventoryBuilder itemName(String itemName) { this.itemName = itemName; return this; }
        public SupplyInventoryBuilder category(String category) { this.category = category; return this; }
        public SupplyInventoryBuilder availableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; return this; }
        public SupplyInventoryBuilder reservedQuantity(Integer reservedQuantity) { this.reservedQuantity = reservedQuantity; return this; }
        public SupplyInventoryBuilder criticalThreshold(Integer criticalThreshold) { this.criticalThreshold = criticalThreshold; return this; }
        public SupplyInventoryBuilder unit(String unit) { this.unit = unit; return this; }

        public SupplyInventory build() {
            return new SupplyInventory(id, itemName, category, availableQuantity, reservedQuantity, criticalThreshold, unit);
        }
    }
}
