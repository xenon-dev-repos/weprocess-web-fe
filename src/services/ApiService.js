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
        toastObj.showSuccess(data.message || successMsg);
        {removeTempToken && localStorage.removeItem('tempToken')}
      }
      
      return data;
    } catch (error) {
      setLoading(false);
      console.error('API request error:', error);

      toastObj.showError(error.message || 'An error occurred');

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


  // Get user profile
  const getUserProfile = async () => {
    return apiRequest(
      API_ENDPOINTS.GET_PROFILE, 
      { method: 'GET' },
      'Profile loaded successfully'
    );
  };

  // Update user profile
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

  return {
    validateEmail,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    verifyOtp,
    requestPasswordReset,
    resetPassword,
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