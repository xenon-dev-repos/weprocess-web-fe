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
  FORGOT_PASSWORD: `${API_BASE_URL}/clients/forgot/password`,
  VERIFY_OTP: `${API_BASE_URL}/clients/validate/otp`,
  CHANGE_PASSWORD: `${API_BASE_URL}/clients/change/password`,

  // data fetch and update
  GET_PROFILE:  `${API_BASE_URL}/clients/:id`,
  UPDATE_PROFILE:  `${API_BASE_URL}/clients/update`,

  // Serves endpoint
  SERVES: `${API_BASE_URL}/serves`,

  // Invoices endpoint
  INVOICES: `${API_BASE_URL}/invoices`,
};

export default API_ENDPOINTS;