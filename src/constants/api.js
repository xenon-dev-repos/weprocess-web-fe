// API endpoints for authentication and user management
const API_BASE_URL = 'https://weprocess.co.uk/v1/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/firms/login`,
  REGISTER_INDIVIDUAL: `${API_BASE_URL}/register`,
  REGISTER_FIRM: `${API_BASE_URL}/firms/register`,
  
  // Email validation
  VALIDATE_IDIVIDUAL_EMAIL: `${API_BASE_URL}/validate/email`,
  VALIDATE_FIRM_EMAIL: `${API_BASE_URL}/firms/validate/email`,
  
  // Password management    
  FORGOT_PASSWORD: `${API_BASE_URL}/firms/forgot/password`,
  VERIFY_OTP: `${API_BASE_URL}/otp/verify`,
  CHANGE_PASSWORD: `${API_BASE_URL}/change/password`,
};

export default API_ENDPOINTS;