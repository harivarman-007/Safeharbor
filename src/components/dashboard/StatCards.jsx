import React from 'react';

const StatCards = ({ activeIncidents, pendingDispatches, availableShelters, criticalShortages }) => {
  return (
    <div className="dashboard-grid">
      {/* Card 1: Active Incidents */}
      <div className="stat-card-mono">
        <div className="stat-card-header">
          <span className="stat-card-title">INCIDENTS</span>
          <span className="mono-tag tag-danger">LIVE</span>
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
        <span className="stat-card-subtitle">Disaster events requiring active response</span>
      </div>

      {/* Card 2: Pending Dispatches */}
      <div className="stat-card-mono">
        <div className="stat-card-header">
          <span className="stat-card-title">DISPATCHES</span>
          <span className="mono-tag tag-neutral">TRANSIT</span>
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
        <span className="stat-card-subtitle">Supply shipments currently en route</span>
      </div>

      {/* Card 3: Available Shelters */}
      <div className="stat-card-mono">
        <div className="stat-card-header">
          <span className="stat-card-title">SHELTERS</span>
          <span className="mono-tag tag-success">ACTIVE</span>
        </div>
        <div className="stat-card-value">{availableShelters}</div>
        <div className="stat-card-meta">
          <div className="meta-row">
            <span className="meta-label">FACILITY</span>
            <span className="meta-val">AVAILABLE</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">CAPACITY</span>
            <span className="meta-val">OPEN</span>
          </div>
        </div>
        <span className="stat-card-subtitle">Relief shelter locations ready for intake</span>
      </div>

      {/* Card 4: Critical Shortages */}
      <div className="stat-card-mono">
        <div className="stat-card-header">
          <span className="stat-card-title">SHORTAGES</span>
          <span className="mono-tag tag-warning">DEFICIT</span>
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
        <span className="stat-card-subtitle">Survival inventory below reserve line</span>
      </div>
    </div>
  );
};

export default StatCards;
