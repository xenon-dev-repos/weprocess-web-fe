import React, { useEffect, useState, useContext, createContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
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
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { triggerRefresh } = useContext(NotificationUpdateContext);

  // Check if current page is chat page
  const isChatPage = location.pathname === ROUTES.CHAT;

  // Fetch once on mount and set up refresh interval
  useEffect(() => {
    // Initialize global interval and timeout tracking if they don't exist
    if (!window.notificationIntervals) {
      window.notificationIntervals = [];
    }
    
    if (!window.notificationTimeouts) {
      window.notificationTimeouts = [];
    }
    
    // Skip initial fetch if on chat page or navigating to chat
    if (!isChatPage && localStorage.getItem('navigatingToChat') !== 'true') {
      // Delay initial fetch slightly to prevent race conditions
      const initialTimeout = setTimeout(() => {
        if (!isChatPage && localStorage.getItem('navigatingToChat') !== 'true') {
          refresh();
        }
      }, 500);
      
      // Track the timeout
      window.notificationTimeouts.push(initialTimeout);
    }
    
    // Set up interval for periodic refreshes, but skip if on chat page
    let interval;
    if (!isChatPage) {
      interval = setInterval(() => {
        // Skip refresh if navigating to chat or already on chat page
        if (localStorage.getItem('navigatingToChat') !== 'true' && 
            window.location.pathname !== ROUTES.CHAT) {
          refresh();
        }
      }, 60000); // 1 minute
      
      // Add interval to global tracking for potential cleanup
      window.notificationIntervals.push(interval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
        // Remove this interval from global tracking
        if (window.notificationIntervals) {
          window.notificationIntervals = window.notificationIntervals.filter(id => id !== interval);
        }
      }
      
      // Clean up any timeouts created in this component
      if (window.notificationTimeouts) {
        window.notificationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        window.notificationTimeouts = [];
      }
    };
    // Only depend on refresh and isChatPage to avoid excessive calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatPage]);

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