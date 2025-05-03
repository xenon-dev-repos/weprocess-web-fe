import { API_ENDPOINTS } from '../constants/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || 'An error occurred';
    throw new Error(error);
  }
  
  return data;
};

/**
 * Create an API service with toast notifications
 * @param {Object} toast - Toast service for displaying notifications
 * @returns {Object} API methods with toast integration
 */
export const createApiService = (toast) => {
  // Ensure we have at least a console logger if toast is not provided
  const toastObj = toast || {
    showSuccess: (msg) => console.log('Success:', msg),
    showError: (msg) => console.error('Error:', msg),
    showInfo: (msg) => console.info('Info:', msg),
    showWarning: (msg) => console.warn('Warning:', msg),
  };

  // Generic API request handler with toast notifications
  const apiRequest = async (url, options = {}, successMsg = null) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      
      const data = await handleResponse(response);
      
      // Show success toast if provided
      if (successMsg) {
        toastObj.showSuccess(data.message || successMsg);
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Show error toast
      toastObj.showError(error.message || 'An error occurred');
      
      throw error;
    }
  };

  // Email validation function
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

  // Get user profile
  const getUserProfile = async () => {
    return apiRequest(
      API_ENDPOINTS.GET_PROFILE, 
      { method: 'GET' },
      'Profile loaded successfully'
    );
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    const formData = new FormData();
    
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    return apiRequest(
      API_ENDPOINTS.UPDATE_PROFILE, 
      {
        method: 'POST',
        body: formData
      },
      'Profile updated successfully'
    );
  };

  return {
    validateEmail,
    getUserProfile,
    updateUserProfile,
    // Add more API methods as needed
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