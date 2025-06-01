import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa"; // For the eye icon
import { MdClose } from "react-icons/md"; // For the close icon
import { IoMdArrowDropdown } from "react-icons/io"; // For dropdown arrow
import { FiImage } from "react-icons/fi"; // For the orange image icon

import "../../styles/notification.css"; 

function NotificationPopup({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(true);

  // Fetch notifications on mount or when userId changes
  useEffect(() => {
    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [userId]);

  // Mark notification as read
  const markAsRead = (id) => {
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=markAsRead&ID=${id}&isRead=true`
    })
      .then(res => res.json())
      .then(() => {
        // Update UI after marking as read
        setNotifications(notifications =>
          notifications.map(n =>
            n.ID === id ? { ...n, isRead: true } : n
          )
        );
      });
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
            {notifications.map((n, idx) => (
              <div className="notification-card" key={n.ID}>
                <div className="notification-card-icon">
                  <FiImage size={32} color="#FF8000" />
                </div>
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
                    <FaEye className="notification-card-eye" />
                    <IoMdArrowDropdown className="notification-card-dropdown" />
                  </div>
                </div>
              </div>
            ))}
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