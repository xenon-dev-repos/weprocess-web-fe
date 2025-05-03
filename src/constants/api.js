// API endpoints for authentication and user management
const API_BASE_URL = 'https://weprocess.co.uk/v1/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/clients/login`,
  REGISTER_INDIVIDUAL: `${API_BASE_URL}/clients/register`,
  REGISTER_FIRM: `${API_BASE_URL}/clients/register`,
  
  // Email validation
  VALIDATE_IDIVIDUAL_EMAIL: `${API_BASE_URL}/clients/validate/email`,
  VALIDATE_FIRM_EMAIL: `${API_BASE_URL}/clients/validate/email`,
  
  // Password management    
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot/password`,
  VERIFY_OTP: `${API_BASE_URL}/clients/validate/otp`,
  CHANGE_PASSWORD: `${API_BASE_URL}/clients/change/password`,
};

export default API_ENDPOINTS;