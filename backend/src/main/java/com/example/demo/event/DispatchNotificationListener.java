package com.example.demo.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DispatchNotificationListener {
    private static final Logger log = LoggerFactory.getLogger(DispatchNotificationListener.class);

    @EventListener
    public void handleDispatchFulfilled(DispatchFulfilledEvent event) {
        log.info("[SafeHarbor Notification] Dispatch #{} fulfilled: {} dispatched for incident '{}'",
                event.getDispatchId(), event.getItemName(), event.getIncidentTitle());
    }
}
