import React from 'react';

const StatCards = ({ activeIncidents, pendingDispatches, availableShelters, criticalShortages }) => {
  return (
    <div className="dashboard-grid">
      <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
        <span className="stat-card-title">Active Incidents</span>
        <span className="stat-card-value">{activeIncidents}</span>
        <span className="stat-card-subtitle">Urgent disaster events requiring response</span>
      </div>

      <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
        <span className="stat-card-title">Pending Dispatches</span>
        <span className="stat-card-value">{pendingDispatches}</span>
        <span className="stat-card-subtitle">Resources awaiting transit approval</span>
      </div>

      <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--success-color)' }}>
        <span className="stat-card-title">Available Shelters</span>
        <span className="stat-card-value">{availableShelters}</span>
        <span className="stat-card-subtitle">Relief shelter facilities registered</span>
      </div>

      <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
        <span className="stat-card-title">Critical Shortages</span>
        <span className="stat-card-value">{criticalShortages}</span>
        <span className="stat-card-subtitle">Survival items below threshold</span>
      </div>
    </div>
  );
};

export default StatCards;
