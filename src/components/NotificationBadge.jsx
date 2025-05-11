import React, { useEffect, useState, useContext, createContext } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../hooks/useNotifications';

// Create a context for notification badge updates
export const NotificationUpdateContext = createContext({
  triggerRefresh: () => {}
});

/**
 * Notification badge provider component to share the refresh context
 */
export const NotificationProvider = ({ children }) => {
  // Using different name to avoid linter warning while keeping the state
  // eslint-disable-next-line no-unused-vars
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const contextValue = {
    triggerRefresh: () => setRefreshCounter(prev => prev + 1)
  };
  
  return (
    <NotificationUpdateContext.Provider value={contextValue}>
      {children}
    </NotificationUpdateContext.Provider>
  );
};

/**
 * NotificationBadge - Shows the number of unread notifications
 * @returns {JSX.Element} Notification badge component
 */
const NotificationBadge = () => {
  const { notifications, refresh } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const { triggerRefresh } = useContext(NotificationUpdateContext);

  // Fetch once on mount and set up refresh interval
  useEffect(() => {
    // Initial fetch
    refresh();
    
    // Set up interval for periodic refreshes
    const interval = setInterval(() => {
      refresh();
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
    // Only depend on refresh to avoid excessive calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  if (unreadCount === 0) return null;

  return (
    <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>
  );
};

const Badge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-error-500);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  font-weight: 600;
`;

export default NotificationBadge; 