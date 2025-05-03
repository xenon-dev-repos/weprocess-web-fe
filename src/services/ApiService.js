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

// Email validation function
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

// Export other API methods as needed
export const ApiService = {
  validateEmail,
};

export default ApiService; 