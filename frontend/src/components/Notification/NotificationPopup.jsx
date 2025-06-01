import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import "../../styles/notification.css"; 

function NotificationPopup({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/notifications?userId=123")
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [userId]);

  const markAsRead = (id) => {
    fetch("backend/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=markAsRead&ID=${id}&isRead=true`
    })
      .then(res => res.json())
      .then(() => {
        setNotifications(notifications =>
          notifications.map(n =>
            n.ID === id ? { ...n, isRead: true } : n
          )
        );
      });
  };

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 1,
    700: 1
  };

  return (
    show && (
      <div className="notification-popup-outer">
        <div className="notification-popup-inner">
          <div className="notification-popup-header">
            <span>Notifications</span>
          </div>
          <div className="notification-popup-list">
            {notifications.length === 0 && (
              <div className="notification-popup-empty">No notifications.</div>
            )}
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="notification-masonry-grid"
              columnClassName="notification-masonry-grid_column"
            >
              {notifications.map((n, idx) => (
                <div className="notification-card" key={n.ID}>
                  <div className="notification-card-content">
                    <div className="notification-card-title">
                      {n.type || "Heading"}
                    </div>
                    <div className="notification-card-message">
                      {n.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    </div>
                    <div className="notification-card-time">
                      {n.createdAt || "time"}
                    </div>
                    <div className="notification-card-actions">
                      {!n.isRead && (
                        <span
                          className="notification-card-dismiss"
                          onClick={() => markAsRead(n.ID)}
                        >
                          dismiss
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </div>
          <div className="notification-popup-footer">
            <button className="notification-popup-close" onClick={() => setShow(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default NotificationPopup;