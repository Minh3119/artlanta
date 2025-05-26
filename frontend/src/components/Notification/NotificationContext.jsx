import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a notification
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [
      ...prev,
      {
        ...notification,
        id: Date.now() + Math.random(), // unique id
        time: new Date(),
      },
    ]);
  }, []);

  // Dismiss a notification by id
  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Provide notifications and functions to children
  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, dismissNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};