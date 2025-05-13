import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Custom hook for managing notifications
 * @returns {Object} Notifications state and functions
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  // Add request tracking to prevent excessive API calls
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const MIN_FETCH_INTERVAL = 10000; // Minimum 10 seconds between API calls

  /**
   * Fetch notifications with pagination
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise} - Promise that resolves when fetch completes
   */
  const fetchNotifications = useCallback(async (page = 1, perPage = 10) => {
    // Check if enough time has passed since the last request
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      console.log('Rate limiting: Too soon to fetch notifications again');
      return null;
    }

    setLoading(true);
    try {
      setLastFetchTime(now);
      // Use the API endpoint from constants
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setNotifications(result.data || []);
      setPagination(result.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0
      });
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      return null;
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  // Initial fetch on mount - only once
  useEffect(() => {
    fetchNotifications();
    // Intentionally not including fetchNotifications in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load more notifications (next page)
   */
  const loadMore = useCallback(() => {
    if (pagination.current_page < pagination.last_page && !loading) {
      fetchNotifications(pagination.current_page + 1, pagination.per_page);
    }
  }, [pagination, loading, fetchNotifications]);

  /**
   * Refresh notifications (first page)
   */
  const refresh = useCallback(() => {
    // Check if enough time has passed since the last request
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      console.log('Rate limiting: Too soon to refresh notifications');
      return;
    }
    
    fetchNotifications(1, pagination.per_page);
  }, [fetchNotifications, pagination.per_page, lastFetchTime]);

  /**
   * Mark a notification as read
   * @param {string} id - Notification ID to mark as read
   */
  const markAsRead = useCallback(async (id) => {
    try {
      // Call API using endpoint from constants
      const url = API_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':id', id);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Update local state to reflect the change
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      return true;
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      return false;
    }
  }, []);

  /**
   * Mark all notifications as read
   * @returns {Promise<boolean>} Success status
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // Use the specific endpoint from constants
      const response = await fetch(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Update local state to reflect the change
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => ({ ...notification, read: true }))
      );
      return true;
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      return false;
    }
  }, []);
  
  return {
    notifications,
    loading,
    error,
    pagination,
    fetchNotifications,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead
  };
};

export default useNotifications; 