import React from 'react';

const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📂</div>
      <p className="empty-state-text">{message || 'No records found.'}</p>
    </div>
  );
};

export default EmptyState;
