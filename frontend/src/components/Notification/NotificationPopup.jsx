import React, { useEffect, useState } from "react";
import { useNotifications } from "./NotificationContext";

const NotificationPopup = () => {
  const [open, setOpen] = useState(false);
  const { notifications, dismissNotification, addNotification } = useNotifications();
    // Example of adding a notification (this can be triggered by any event)

    useEffect(() => {
        addNotification({
            title: "Welcome!",
            message: "You have new notifications.",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // This effect runs once when the component mounts to add a welcome notification

  return (
    <>
      <button onClick={() => setOpen(true)} className="notification-button">
        Notifications ({notifications.length})
      </button>
      {open && (
        <div className="notification-popup">
          <div className="notification-popup-header">
            <h4>Notifications</h4>
            <button onClick={() => setOpen(false)} className="close-button">
              Close
            </button>
          </div>
          <button
            onClick={() =>
              addNotification({
                title: "Test Notification",
                message: "This notification was added from NotificationPopup.",
              })
            }
          >
            Add Test Notification
          </button> {/* Example button to add a notification */}
          <ul className="notification-popup-list">
            {notifications.length === 0 ? (
              <li>No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                  <span className="notification-time">
                    {new Date(notification.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    className="notification-dismiss"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    Dismiss
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default NotificationPopup;

// póp úp lít nô tì