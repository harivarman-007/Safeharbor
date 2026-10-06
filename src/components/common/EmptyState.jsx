import React from 'react';

const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 10h10" />
          <path d="M7 14h6" />
        </svg>
      </div>
      <p className="empty-state-text">{message || 'No records found.'}</p>
    </div>
  );
};

export default EmptyState;
