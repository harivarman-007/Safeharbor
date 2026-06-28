import React from 'react';

const NotificationStack = ({ notifications, removeNotification }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="notification-stack-container">
      {notifications.map((notif) => {
        let typeClass = 'toast-success';
        if (notif.type === 'error') {
          typeClass = 'toast-error';
        } else if (notif.type === 'warning') {
          typeClass = 'toast-warning';
        }

        return (
          <div key={notif.id} className={`notification-toast ${typeClass}`}>
            <span>{notif.message}</span>
            <button
              className="toast-close-btn"
              onClick={() => removeNotification(notif.id)}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationStack;
