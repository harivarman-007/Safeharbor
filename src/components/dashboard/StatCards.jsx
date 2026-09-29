import React from 'react';

const StatCards = ({ activeIncidents, pendingDispatches, availableShelters, criticalShortages }) => {
  return (
    <div className="dashboard-grid">
      <div className="glass-panel stat-card">
        <span className="stat-card-title">Active Incidents</span>
        <span className="stat-card-value">{activeIncidents}</span>
        <span className="stat-card-subtitle">Active disaster events requiring deployment</span>
      </div>

      <div className="glass-panel stat-card">
        <span className="stat-card-title">Pending Dispatches</span>
        <span className="stat-card-value">{pendingDispatches}</span>
        <span className="stat-card-subtitle">Supply shipments currently in transit</span>
      </div>

      <div className="glass-panel stat-card">
        <span className="stat-card-title">Available Shelters</span>
        <span className="stat-card-value">{availableShelters}</span>
        <span className="stat-card-subtitle">Operational relief facilities open</span>
      </div>

      <div className="glass-panel stat-card">
        <span className="stat-card-title">Critical Shortages</span>
        <span className="stat-card-value">{criticalShortages}</span>
        <span className="stat-card-subtitle">Survival essentials below threshold</span>
      </div>
    </div>
  );
};

export default StatCards;
