import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../../styles/notification.css";

function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // First fetch current user
    fetch('http://localhost:9999/backend/api/current-user', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCurrentUser(data.response);
          // Then fetch notifications using the user's ID
          return fetch(`http://localhost:9999/backend/api/notifications?userId=${data.response.id}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
          });
        }
      })
      .then(res => res?.json())
      .then(data => {
        if (data && !data.error) {
          setNotifications(data);
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const toggleRead = (id, currentIsRead) => {
    if (!currentUser) return;
    

    fetch("http://localhost:9999/backend/api/notifications", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=markAsRead&ID=${id}&isRead=${!currentIsRead}&userId=${currentUser.id}`,
    })
      .then((res) => res.json())
      .then(() => {
        setNotifications((notifications) =>
          notifications.map((n) =>
            n.id === id ? { ...n, isRead: !currentIsRead } : n
          )
        );
      });
  };

  const dismiss = (id) => {
    if (!currentUser) return;

    fetch("http://localhost:9999/backend/api/notifications", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=delete&ID=${id}&userId=${currentUser.id}`,
    })
      .then((res) => res.json())
      .then(() => {
        setNotifications(notifications =>
          notifications.filter(n => n.id !== id)
        );
      })
      .catch(error => console.error('Error dismissing notification:', error));
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const breakpointColumnsObj = {
    default: 1,
    700: 1,
  };

  // SVGs for eye icons
  const BlueEye = (
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="6"
        stroke="blue"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.5" fill="blue" />
    </svg>
  );
  const RedEyeSlash = (
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="6"
        stroke="red"
        strokeWidth="2"
        fill="none"
      />
      <line x1="5" y1="19" x2="19" y2="5" stroke="red" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="notification-popup-outer">
      <div className="notification-popup-inner" onClick={e => e.stopPropagation()}>
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
              <div
                className="notification-card"
                key={n.id}
                style={n.postId ? { cursor: "pointer" } : {}}
                onClick={n.postId ? () => navigate(`/post/${n.postId}`) : undefined}
                tabIndex={n.postId ? 0 : undefined}
                role={n.postId ? "button" : undefined}
                onKeyDown={
                  n.postId
                    ? e => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/post/${n.postId}`);
                        }
                      }
                    : undefined
                }
              >
                <div className="notification-card-content">
                  <div className="notification-card-title">
                    {n.type || "Heading"}
                  </div>
                  <div className="notification-card-message">
                    {n.content || "content"}
                  </div>
                  <div className="notification-card-time">
                    {formatTimeAgo(n.createdAt)}
                  </div>
                  <div className="notification-card-actions">
                    <button
                      className="notification-card-dismiss"
                      onClick={() => dismiss(n.id)}
                      style={{ cursor: "pointer", fontSize: "1em" }}
                      title="Dismiss notification"
                    >
                      Dismiss
                    </button>
                    <span
                      className="notification-card-toggle-eye"
                      onClick={() => toggleRead(n.id, n.isRead)}
                      style={{ cursor: "pointer", fontSize: "1.2em" }}
                      title={n.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {n.isRead ? RedEyeSlash : BlueEye}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
        <div className="notification-popup-footer">
          <button className="notification-popup-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
