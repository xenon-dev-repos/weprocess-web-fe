// API endpoint constants
export const API_BASE_URL = 'https://weprocess.co.uk/v1/api';

export const API_ENDPOINTS = {
  // Auth endpoints
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
  
  // Profile endpoints
  GET_PROFILE: `${API_BASE_URL}/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/profile/update`,
  
  // Chat endpoints
  GET_CHAT_SESSIONS: `${API_BASE_URL}/chat/sessions`,
  GET_CHAT_MESSAGES: `${API_BASE_URL}/chat`,  // Will be used as base URL + /:chat_session_id/messages
  SEND_CHAT_MESSAGE: `${API_BASE_URL}/chat/send-message`,
  MARK_CHAT_AS_READ: `${API_BASE_URL}/chat`  // Will be used as base URL + /:chat_session_id/read
};

export default API_ENDPOINTS;