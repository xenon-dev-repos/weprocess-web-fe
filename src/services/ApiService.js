import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';

// Mock data for development and fallback
const MOCK_CHAT_SESSIONS = [
  {
    chat_session_id: "1",
    participant: {
      id: "101",
      type: "client",
      name: "John Smith",
      profile_picture_url: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    latest_message: {
      text: "Looking forward to our meeting tomorrow!",
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
    },
    unread_count: 2
  },
  {
    chat_session_id: "2",
    participant: {
      id: "102",
      type: "client",
      name: "Emma Johnson",
      profile_picture_url: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    latest_message: {
      text: "I've sent you the documents you requested.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    unread_count: 0
  },
  {
    chat_session_id: "3",
    participant: {
      id: "103",
      type: "client",
      name: "Alex Williams",
      profile_picture_url: null
    },
    latest_message: {
      text: "Thanks for your help with the tax issue!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    unread_count: 1
  }
];

const MOCK_MESSAGES = {
  "1": [
    {
      id: "101",
      text: "Hello, I have a question about my account",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      media_url: null
    },
    {
      id: "102",
      text: "Sure, I'd be happy to help. What's your question?",
      is_sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      media_url: null
    },
    {
      id: "103",
      text: "I'm wondering about the status of my invoice #12345",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      media_url: null
    },
    {
      id: "104",
      text: "Let me check that for you right away",
      is_sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      media_url: null
    },
    {
      id: "105",
      text: "Looking forward to our meeting tomorrow!",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      media_url: null
    }
  ],
  "2": [
    {
      id: "201",
      text: "Hi, do you have time to review the contract?",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      media_url: null
    },
    {
      id: "202",
      text: "Yes, I can look at it this afternoon",
      is_sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      media_url: null
    },
    {
      id: "203",
      text: "Great, here are the documents",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
      media_url: "contract.pdf"
    },
    {
      id: "204",
      text: "I've sent you the documents you requested.",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      media_url: null
    }
  ],
  "3": [
    {
      id: "301",
      text: "Hello, I need help with a tax issue",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      media_url: null
    },
    {
      id: "302",
      text: "Could you provide more details?",
      is_sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
      media_url: null
    },
    {
      id: "303",
      text: "I received a notice from the IRS about missing documentation",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      media_url: "notice.jpg"
    },
    {
      id: "304",
      text: "I'll take care of this for you",
      is_sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      media_url: null
    },
    {
      id: "305",
      text: "Thanks for your help with the tax issue!",
      is_sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      media_url: null
    }
  ]
};

// Flag to control whether to use mock data (true = always use mock, false = try API first)
const ALWAYS_USE_MOCK = false;

// Debug mode - set to true to enable console logs for API operations
const DEBUG = true;

// Helper function for logging in debug mode
const logDebug = (...args) => {
  if (DEBUG) {
    console.log('[ApiService]', ...args);
  }
};

// Default API base URL
const API_BASE_URL = 'https://weprocess.co.uk/v1/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || 'An error occurred';
    throw new Error(error);
  }
  
  return data;
};

// Create a configured axios instance
const createAxiosInstance = (toast) => {
  const instance = axios.create({
    baseURL: window.env?.REACT_APP_API_URL || API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle general error cases
      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        
        if (status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast?.showError('Your session has expired. Please log in again.');
        } else if (status === 403) {
          // Forbidden
          toast?.showError('You do not have permission to perform this action.');
        } else if (status === 404) {
          // Not found
          toast?.showError('The requested resource was not found.');
        } else if (status === 429) {
          // Rate limited
          toast?.showError('Too many requests. Please try again in a few seconds.');
        } else if (status === 500) {
          // Server error
          toast?.showError('Something went wrong on our end. Please try again later.');
        } else {
          // Other errors
          const message = error.response.data?.message || 'An error occurred';
          toast?.showError(message);
        }
      } else if (error.request) {
        // Request was made but no response was received (network error)
        toast?.showError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened in setting up the request
        toast?.showError('An error occurred. Please try again.');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Create an API service with toast notifications
 * @param {Object} toast - Toast service for displaying notifications
 * @returns {Object} API methods with toast integration
 */
export const createApiService = (toast) => {
  // Initialize axios with auth headers for non-full-URL requests
  createAxiosInstance(toast);

  return {
    // Chat Sessions API
    getChatSessions: async () => {
      // If ALWAYS_USE_MOCK is true, return mock data immediately
      if (ALWAYS_USE_MOCK) {
        logDebug('Using mock chat sessions data');
        return { success: true, data: MOCK_CHAT_SESSIONS };
      }
      
      try {
        logDebug('Fetching chat sessions from API...');
        // Use full URL endpoint
        const response = await axios.get(`${API_ENDPOINTS.GET_CHAT_SESSIONS}?page=1&per_page=10`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        logDebug('API response for chat sessions:', response);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
        logDebug('Falling back to mock chat sessions data due to error');
        
        // Fallback to mock data when the API fails
        return { success: true, data: MOCK_CHAT_SESSIONS };
      }
    },
    
    // Chat Messages API
    getChatMessages: async (sessionId) => {
      // If ALWAYS_USE_MOCK is true, return mock data immediately
      if (ALWAYS_USE_MOCK) {
        logDebug(`Using mock messages data for session ${sessionId}`);
        return { 
          success: true, 
          data: MOCK_MESSAGES[sessionId] || [] 
        };
      }
      
      try {
        logDebug(`Fetching messages for session ${sessionId} from API...`);
        // Use full URL endpoint with chat session ID
        const response = await axios.get(`${API_ENDPOINTS.GET_CHAT_MESSAGES}/${sessionId}/messages?page=1&per_page=10`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        logDebug(`API response for session ${sessionId} messages:`, response);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        logDebug(`Falling back to mock messages for session ${sessionId} due to error`);
        
        // Fallback to mock data when the API fails
        return { 
          success: true, 
          data: MOCK_MESSAGES[sessionId] || [] 
        };
      }
    },
    
    // Send Message API
    sendChatMessage: async (participantId, participantType, text, media = null) => {
      // If ALWAYS_USE_MOCK is true, simulate sending a message
      if (ALWAYS_USE_MOCK) {
        logDebug('Using mock send message');
        
        // Create a mock response
        const mockMessageId = `new-${Date.now()}`;
        const mockResponse = { 
          success: true, 
          data: {
            id: mockMessageId,
            text: text,
            is_sent: true,
            timestamp: new Date().toISOString(),
            media_url: media ? media.name : null
          }
        };
        
        logDebug('Mock message response:', mockResponse);
        return mockResponse;
      }
      
      try {
        logDebug('Sending message to API...', { participantId, participantType, text });
        const formData = new FormData();
        formData.append('participant_id', participantId);
        formData.append('participant_type', participantType);
        formData.append('text', text);
        
        if (media) {
          formData.append('media', media);
          logDebug('Message includes media attachment');
        }
        
        // Use full URL endpoint
        const response = await axios.post(API_ENDPOINTS.SEND_CHAT_MESSAGE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        logDebug('API response for sending message:', response);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Error sending chat message:', error);
        logDebug('Falling back to mock message response due to error');
        
        // Fallback to a mock response when the API fails
        return { 
          success: false, 
          error: error.message || 'Failed to send message' 
        };
      }
    },
    
    // Mark chat as read
    markChatAsRead: async (sessionId) => {
      try {
        logDebug(`Marking chat session ${sessionId} as read...`);
        // Use full URL endpoint with chat session ID
        const response = await axios.post(`${API_ENDPOINTS.MARK_CHAT_AS_READ}/${sessionId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        logDebug('API response for marking chat as read:', response);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Error marking chat as read:', error);
        return { success: false, error: error.message || 'Failed to mark chat as read' };
      }
    }
  };
};

// Standalone functions for use without toast context
export const validateEmail = async (email, accountType) => {
  const endpoint = accountType === 'firm' 
    ? API_ENDPOINTS.VALIDATE_FIRM_EMAIL 
    : API_ENDPOINTS.VALIDATE_IDIVIDUAL_EMAIL;
  
  const formData = new FormData();
  formData.append('email', email);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Email validation error:', error);
    throw error;
  }
};

// Default export without toast integration
export default {
  validateEmail,
}; 