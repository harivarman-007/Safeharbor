import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div>
      <h3 style={{ marginBottom: '1.25rem' }}>Recent Operations Activity</h3>
      {activities && activities.length > 0 ? (
        <ul className="activity-list">
          {activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <span className="activity-text">{activity.title}</span>
              <span className="activity-date">
                {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          No operations log recorded today.
        </p>
      )}
    </div>
  );
};

export default RecentActivity;
