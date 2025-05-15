import { API_ENDPOINTS } from '../constants/api';
import { GLOBAL_SESSION_REQUEST } from '../utils/RequestTracker';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || 'An error occurred';
    throw new Error(error);
  }
  
  return data;
};

// Shared API service sessions cache
const SESSION_CACHE = {
  data: null,
  timestamp: 0,
  cacheKey: null,
  inProgress: false, // Track if a request is in progress
  lastCallTime: 0    // Track the time of the last call
};

/**
 * Create an API service with toast notifications
 * @param {Object} toast - Toast service for displaying notifications
 * @returns {Object} API methods with toast integration
 */
export const CreateApiService = (toast, setLoading) => {
  let tempToken = null;

  // Ensure we have at least a console logger if toast is not provided
  const toastObj = toast || {
    showSuccess: (msg) => console.log('Success:', msg),
    showError: (msg) => console.error('Error:', msg),
    showInfo: (msg) => console.info('Info:', msg),
    showWarning: (msg) => console.warn('Warning:', msg),
  };

  const apiRequest = async (url, options = {}, successMsg = null, useTempToken = false, removeTempToken = false) => {
    try {
      setLoading(true)

      const headers = {
        ...(options.headers || {}),
        "Accept": "application/json",
      };

      if (useTempToken) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('tempToken') || ''}`;
      } else {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token') || ''}`;
      }

      const response = await fetch(url, {
        ...options,
        headers
      });
      
      const data = await handleResponse(response);
      
      if (successMsg) {
        setLoading(false);
        if (options.method !== 'GET') {
          toastObj.showSuccess(data.message || successMsg);
        }
        {removeTempToken && localStorage.removeItem('tempToken')}
      }
      
      return data;
    } catch (error) {
      setLoading(false);
      console.error('API request error:', error);

      if (options.method !== 'GET') {
        toastObj.showError(error.message || 'An error occurred');
      }

      throw error;
    }
  };

  const validateEmail = async (email, accountType) => {
    const endpoint = accountType === 'firm' 
      ? API_ENDPOINTS.VALIDATE_FIRM_EMAIL 
      : API_ENDPOINTS.VALIDATE_IDIVIDUAL_EMAIL;
    
    const formData = new FormData();
    formData.append('email', email);
    
    return apiRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  };

  const verifyOtp = async (email, otp) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    
    return apiRequest(
      API_ENDPOINTS.VERIFY_OTP, 
      {
        method: 'POST',
        body: formData
      },
      'OTP verified successfully',
      true // Use temporary token for this request
    );
  };

  const requestPasswordReset = async (email) => {
    const formData = new FormData();
    formData.append('email', email);
    
    const response = await apiRequest(
      API_ENDPOINTS.FORGOT_PASSWORD, 
      {
        method: 'POST',
        body: formData
      },
      'Password reset email sent successfully'
    );

    // Store the temporary token if received
    if (response.token) {
      tempToken = response.token;
      localStorage.setItem('tempToken',tempToken)
    }

    return response;
  };

  const resetPassword = async (email, newPassword) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', newPassword);
    
    return apiRequest(API_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      body: formData
    }, 'Password reset successfully',
    true, // Use temporary token for this request
    true  // remove temporary token from storage after this request success
  );
  };

  const getUserProfile = async () => {
    return apiRequest(
      API_ENDPOINTS.GET_PROFILE, 
      { method: 'GET' },
      'Profile loaded successfully'
    );
  };

  const updateUserProfile = async (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('_method', 'PATCH')
    
    return apiRequest(
      API_ENDPOINTS.UPDATE_PROFILE, 
      {
        method: 'POST',
        body: formData
      },
      'Profile updated successfully'
    );
  };

  const updateUserPassword = async (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('_method', 'PATCH')
    
    return apiRequest(
      API_ENDPOINTS.UPDATE_PROFILE, 
      {
        method: 'POST',
        body: formData
      },
      'Password updated successfully'
    );
  };

  const createInstructionServe = async (formData) => {
    try {
      const response = await apiRequest(
        API_ENDPOINTS.CREATE_SERVES,
        {
          method: 'POST',
          body: formData,
        },
        'Serve created successfully'
      );
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const getServeById = async (id) => {
    try {
      return await apiRequest(
        `${API_ENDPOINTS.GET_SERVE_BY_ID.replace(':id', id)}`,
        { method: 'GET' },
        'Serve loaded successfully'
      );
    } catch (error) {
      console.error('Error fetching serve:', error);
      throw error;
    }
  };

  const getInvoiceById = async (id) => {
    try {
      return await apiRequest(
        `${API_ENDPOINTS.GET_INVOICE_BY_ID.replace(':id', id)}`,
        { method: 'GET' },
        'Invoice loaded successfully'
      );
    } catch (error) {
      console.error('Error fetching Invoice:', error);
      throw error;
    }
  };

  /**
   * Fetch user notifications
   * @param {number} page - Page number
   * @param {number} perPage - Notifications per page
   * @returns {Promise<Object>} Notifications data
   */
  const getNotifications = async (page = 1, perPage = 10) => {
    const url = `${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&per_page=${perPage}`;
    return apiRequest(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  };

  /**
   * Mark a notification as read
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Success response
   */
  const markNotificationAsRead = async (id) => {
    const url = API_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':id', id);
    return apiRequest(
      url,
      {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      },
      'Notification marked as read'
    );
  };

  /**
   * Get all chat sessions for the user
   * @param {number} page - Page number
   * @param {number} perPage - Number of items per page
   * @returns {Promise<Object>} Chat sessions data
   */
  const getChatSessions = async (page = 1, perPage = 10) => {
    const url = `${API_ENDPOINTS.GET_CHAT_SESSIONS}?page=${page}&per_page=${perPage}`;
    
    const token = localStorage.getItem('token') || '';
    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }
    
    // Check if chat page is loaded (to prevent duplicate calls)
    const isChatPageLoaded = localStorage.getItem('chatPageLoaded') === 'true';
    
    // Check global request tracker first (prevents duplicate calls with useChat.js)
    if (GLOBAL_SESSION_REQUEST && GLOBAL_SESSION_REQUEST.inProgress) {
      console.log('ApiService: Global session request already in progress, skipping duplicate call');
      
      // If we have cached data, return it
      if (SESSION_CACHE.data) {
        return SESSION_CACHE.data;
      }
      
      // Otherwise wait a bit and try again with the cached data
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (SESSION_CACHE.data) {
        return SESSION_CACHE.data;
      }
      
      throw new Error('Request in progress');
    }
    
    // Skip if a request is already in progress
    if (SESSION_CACHE.inProgress) {
      console.log('ApiService: Session request already in progress, skipping duplicate call');
      
      // If we have cached data, return it
      if (SESSION_CACHE.data) {
        return SESSION_CACHE.data;
      }
      
      // Otherwise wait a bit and try again with the cached data
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (SESSION_CACHE.data) {
        return SESSION_CACHE.data;
      }
      
      throw new Error('Request in progress');
    }
    
    // Rate limit API calls
    const now = Date.now();
    const minInterval = 60000; // 60 seconds between API calls (increased from 30s)
    
    // Check both local and global last call times
    const lastCallTime = Math.max(
      SESSION_CACHE.lastCallTime,
      GLOBAL_SESSION_REQUEST ? GLOBAL_SESSION_REQUEST.lastRequestTime : 0
    );
    
    if (now - lastCallTime < minInterval) {
      console.log(`ApiService: Throttling session request (${now - lastCallTime}ms since last call)`);
      
      // If we have cached data, return it
      if (SESSION_CACHE.data) {
        return SESSION_CACHE.data;
      }
    }
    
    // Generate cache key
    const cacheKey = `sessions_${page}_${perPage}_${token.substring(0, 10)}`;
    
    // Use cached data if it's less than 5 minutes old
    if (isChatPageLoaded && SESSION_CACHE.data && SESSION_CACHE.cacheKey === cacheKey && now - SESSION_CACHE.timestamp < 300000) {
      console.log('ApiService: Using cached sessions data (max 5 min)');
      return SESSION_CACHE.data;
    }
    
    try {
      // Mark that we're making a request in both local and global trackers
      SESSION_CACHE.inProgress = true;
      if (GLOBAL_SESSION_REQUEST) {
        GLOBAL_SESSION_REQUEST.inProgress = true;
      }
      
      // Update last call time in both trackers
      SESSION_CACHE.lastCallTime = now;
      if (GLOBAL_SESSION_REQUEST) {
        GLOBAL_SESSION_REQUEST.lastRequestTime = now;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Prevent browser caching
      });
      
      const data = await handleResponse(response);
      
      // Cache the response
      SESSION_CACHE.data = data;
      SESSION_CACHE.timestamp = now;
      SESSION_CACHE.cacheKey = cacheKey;
      
      return data;
    } catch (error) {
      console.error('ApiService: Error fetching chat sessions:', error);
      throw error;
    } finally {
      // Clear the in-progress flag with a slight delay to prevent race conditions
      setTimeout(() => {
        SESSION_CACHE.inProgress = false;
        if (GLOBAL_SESSION_REQUEST) {
          GLOBAL_SESSION_REQUEST.inProgress = false;
        }
      }, 800);
    }
  };

  /**
   * Get messages for a specific chat session
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object>} Chat messages data
   */
  const getChatSessionMessages = async (sessionId) => {
    const url = API_ENDPOINTS.GET_CHAT_MESSAGES.replace(':sessionId', sessionId);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Prevent caching issues
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('429 Too Many Requests');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  };

  /**
   * Send a new message in a chat
   * @param {Object} messageData - Message data (sessionId, content, etc.)
   * @returns {Promise<Object>} Success response
   */
  const sendMessage = async (messageData) => {
    const url = API_ENDPOINTS.SEND_MESSAGE;
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }
    
    const formData = new FormData();
    Object.entries(messageData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('429 Too Many Requests');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  /**
   * Mark a chat as read
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object>} Success response
   */
  const markChatAsRead = async (sessionId) => {
    const url = API_ENDPOINTS.MARK_CHAT_AS_READ;
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }
    
    const formData = new FormData();
    formData.append('session_id', sessionId);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('429 Too Many Requests');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking chat as read:', error);
      throw error;
    }
  };

  return {
    validateEmail,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    verifyOtp,
    requestPasswordReset,
    resetPassword,

    createInstructionServe,
    getServeById,
    getInvoiceById,
    getNotifications,
    markNotificationAsRead,
    getChatSessions,
    getChatSessionMessages,
    sendMessage,
    markChatAsRead,
  };
};

// Standalone functions for use without toast context
export const validateEmail = async (email, accountType) => {
  const endpoint = accountType === 'firm' 
    ? API_ENDPOINTS.VALIDATE_FIRM_EMAIL 
    : API_ENDPOINTS.VALIDATE_IDIVIDUAL_EMAIL;
  
  const formData = new FormData();
  formData.append('email', email);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });
  
  return handleResponse(response);
};

/**
 * Get user notifications
 * @param {number} page - Page number
 * @param {number} perPage - Notifications per page
 * @returns {Promise<Object>} Notifications data
 */
export const getNotifications = async (page = 1, perPage = 10) => {
  const url = `${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&per_page=${perPage}`;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  };

  const response = await fetch(url, { method: 'GET', headers });
  return handleResponse(response);
};

/**
 * Mark a notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success response
 */
export const markNotificationAsRead = async (id) => {
  const url = API_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':id', id);
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  };

  const response = await fetch(url, { method: 'POST', headers });
  return handleResponse(response);
};

/**
 * Get messages for a specific chat session
 * @param {string} sessionId - Chat session ID
 * @returns {Promise<Object>} Chat messages data
 */
export const getChatSessionMessages = async (sessionId) => {
  const url = API_ENDPOINTS.GET_CHAT_MESSAGES.replace(':sessionId', sessionId);
  const token = localStorage.getItem('token') || '';
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};

/**
 * Send a new message in a chat
 * @param {Object} messageData - Message data (sessionId, content, etc.)
 * @returns {Promise<Object>} Success response
 */
export const sendMessage = async (messageData) => {
  const url = API_ENDPOINTS.SEND_MESSAGE;
  const token = localStorage.getItem('token') || '';
  
  const formData = new FormData();
  Object.entries(messageData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return handleResponse(response);
};

/**
 * Mark a chat as read
 * @param {string} sessionId - Chat session ID
 * @returns {Promise<Object>} Success response
 */
export const markChatAsRead = async (sessionId) => {
  const url = API_ENDPOINTS.MARK_CHAT_AS_READ;
  const token = localStorage.getItem('token') || '';
  
  const formData = new FormData();
  formData.append('session_id', sessionId);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return handleResponse(response);
};

// Default export without toast integration
export default {
  validateEmail,
  getNotifications,
  markNotificationAsRead
}; 