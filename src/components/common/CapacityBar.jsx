import React from 'react';

const CapacityBar = ({ current, capacity }) => {
  const percentage = capacity > 0 ? Math.min((current / capacity) * 100, 100) : 0;

  // Determine bar color based on percentage
  let barColor = 'var(--success-color)';
  if (percentage >= 90) {
    barColor = 'var(--danger-color)';
  } else if (percentage >= 75) {
    barColor = 'var(--warning-color)';
  }

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Occupancy: {current} / {capacity}</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="capacity-bar-container">
        <div
          className="capacity-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;
