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
      // Prepare FormData for the request
      const formDataToSend = new FormData();
      
      // Append all the form data fields
      Object.entries(formData).forEach(([key, value]) => {
        // Handle array fields
        if (Array.isArray(value)) {
          if (key === 'documents') {
            // Append each document file
            value.forEach(doc => {
              formDataToSend.append('documents[]', doc.file);
            });
          } else if (key === 'document_urls') {
            // Append each document URL
            value.forEach(url => {
              formDataToSend.append('document_urls[]', url);
            });
          } else {
            // Join array with commas for simple string arrays
            formDataToSend.append(key, value.join(','));
          }
        } 
        // Handle file uploads
        else if (value && typeof value === 'object' && value.file instanceof Blob) {
          formDataToSend.append(key, value.file);
        }
        // Handle other fields
        else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
  
      // Append document labels if they exist
      if (formData.documentLabels) {
        Object.entries(formData.documentLabels).forEach(([id, label]) => {
          formDataToSend.append(`document_labels[${id}]`, label);
        });
      }
  
      // Make the API request
      // const response = await apiRequest(API_ENDPOINTS.CREATE_SERVES,
      //   {
      //     method: 'POST',
      //     body: formDataToSend,
      //   },
      //   'Serve created successfully',
      //   false,
      //   false
      // )(toast, setLoading);

      const response = await apiRequest(
        API_ENDPOINTS.CREATE_SERVES,
        {
          method: 'POST',
          body: formDataToSend,
        },
        'Serve created successfully',
      );
  
      return response;
      
    } catch (error) {
      console.error('Error creating instruction serve:', error);
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