package com.example.demo.event;

import org.springframework.context.ApplicationEvent;

public class DispatchFulfilledEvent extends ApplicationEvent {
    private final Long dispatchId;
    private final String itemName;
    private final String incidentTitle;

    public DispatchFulfilledEvent(Object source, Long dispatchId, String itemName, String incidentTitle) {
        super(source);
        this.dispatchId = dispatchId;
        this.itemName = itemName;
        this.incidentTitle = incidentTitle;
    }

    public Long getDispatchId() {
        return dispatchId;
    }

    public String getItemName() {
        return itemName;
    }

    public String getIncidentTitle() {
        return incidentTitle;
    }
}
