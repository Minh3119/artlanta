import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messageHandlers, setMessageHandlers] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messageHandlersRef = useRef(messageHandlers);

  // Update ref when messageHandlers state changes
  useEffect(() => {
    messageHandlersRef.current = messageHandlers;
  }, [messageHandlers]);

  // Check if user is authenticated, if yes, update currentUserId and isAuthenticated
  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9999/backend/api/current-user', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        // User not authenticated
        setIsAuthenticated(false);
        setCurrentUserId(null);
        return false;
      }
      
      const data = await response.json();
      
      if (data.response && data.response.id) {   // user authenticated
        setIsAuthenticated(true);
        setCurrentUserId(data.response.id);
        return true;
      } else {    // user not authenticated
        setIsAuthenticated(false);
        setCurrentUserId(null);
        return false;
      }
    } catch (err) {
      console.error('Failed to check authentication:', err);
      setIsAuthenticated(false);
      setCurrentUserId(null);
      return false;
    }
  }, []);

  // Fetch current user and establish WebSocket connection
  const initializeWebSocket = useCallback(async () => {
    try {
      // First, get the current user
      const response = await fetch('http://localhost:9999/backend/api/current-user', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Not logged in');
      }
      
      const data = await response.json();
      const userId = data.response.id;
      setCurrentUserId(userId);
      setIsAuthenticated(true);

      // Now establish WebSocket connection
      ws.current = new WebSocket('ws://localhost:9999/backend/ws/message');
      
      ws.current.onopen = () => {
        console.log('WebSocket connection opened successfully');
        setIsConnected(true);
      };
      
      ws.current.onclose = (event) => {
        console.log('WebSocket close details - Code:', event.code, 'Reason:', event.reason, 'WasClean:', event.wasClean);
        setIsConnected(false);
        
        // If the connection was closed due to authentication issues, re-check auth
        if (event.code === 1000 || event.code === 1001) {
          // Normal closure or going away - might be logout
          checkAuthentication();
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          // Notify all registered message handlers
          messageHandlersRef.current.forEach(handler => {
            try {
              handler(payload);
            } catch (err) {
              console.error('Error in message handler:', err);
            }
          });
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      setIsConnected(false);
      setIsAuthenticated(false);
    }
  }, [checkAuthentication]);

  // Register a message handler
  const registerMessageHandler = useCallback((handler) => {
    setMessageHandlers(prev => new Set(prev).add(handler));
    
    // Return cleanup function
    return () => {
      setMessageHandlers(prev => {
        const newSet = new Set(prev);
        newSet.delete(handler);
        return newSet;
      });
    };
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Initialize WebSocket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      initializeWebSocket();
    } else if (!isAuthenticated) {
      console.log('WebSocketProvider: User not authenticated, closing WebSocket');
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }

    // Cleanup on unmount or when authentication changes
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [isAuthenticated, currentUserId, initializeWebSocket]);

  const value = {
    ws: ws.current,
    isConnected,
    currentUserId,
    isAuthenticated,
    sendMessage,
    registerMessageHandler,
    initializeWebSocket,
    checkAuthentication
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 