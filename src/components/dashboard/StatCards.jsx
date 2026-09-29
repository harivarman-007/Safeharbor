import React from 'react';

const StatCards = ({ activeIncidents, pendingDispatches, availableShelters, criticalShortages }) => {
  return (
    <div className="dashboard-grid">
      {/* Card 1: Active Incidents */}
      <div className="glass-panel stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Incidents</span>
          <span className="card-tag">Active</span>
        </div>
        <div className="stat-card-value">{activeIncidents}</div>
        <div className="stat-card-meta">
          <div className="meta-row">
            <span className="meta-label">STATUS</span>
            <span className="meta-val">DEPLOYED</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">PRIORITY</span>
            <span className="meta-val">URGENT</span>
          </div>
        </div>
        <span className="stat-card-subtitle">Active disaster events requiring deployment</span>
      </div>

      {/* Card 2: Pending Dispatches */}
      <div className="glass-panel stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Dispatches</span>
          <span className="card-tag">Transit</span>
        </div>
        <div className="stat-card-value">{pendingDispatches}</div>
        <div className="stat-card-meta">
          <div className="meta-row">
            <span className="meta-label">FLEET</span>
            <span className="meta-val">COORDINATED</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">CHANNEL</span>
            <span className="meta-val">LOGISTICS</span>
          </div>
        </div>
        <span className="stat-card-subtitle">Supply shipments currently in transit</span>
      </div>

      {/* Card 3: Available Shelters — Featured Turquoise Glass Card like the reference photo */}
      <div className="glass-panel stat-card stat-card-turquoise">
        <div className="stat-card-header">
          <span className="stat-card-title">Shelters</span>
          <span className="card-tag">Online</span>
        </div>
        <div className="stat-card-value">{availableShelters}</div>
        <div className="stat-card-meta">
          <div className="meta-row">
            <span className="meta-label">TYPE</span>
            <span className="meta-val">TURQUOISE</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">HEX</span>
            <span className="meta-val">#99E1D9</span>
          </div>
        </div>
        <span className="stat-card-subtitle">Operational relief facilities open</span>
      </div>

      {/* Card 4: Critical Shortages */}
      <div className="glass-panel stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Shortages</span>
          <span className="card-tag">Alert</span>
        </div>
        <div className="stat-card-value">{criticalShortages}</div>
        <div className="stat-card-meta">
          <div className="meta-row">
            <span className="meta-label">STOCK</span>
            <span className="meta-val">CRITICAL</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">RESTOCK</span>
            <span className="meta-val">REQUIRED</span>
          </div>
        </div>
        <span className="stat-card-subtitle">Survival essentials below threshold</span>
      </div>
    </div>
  );
};

export default StatCards;
