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
  CREATE_SERVES: `${API_BASE_URL}/serves`,
  GET_SERVE_BY_ID: `${API_BASE_URL}/serves/:id`,
  GET_INVOICE_BY_ID: `${API_BASE_URL}/invoices/:id`,

  // Invoices endpoint
  INVOICES: `${API_BASE_URL}/invoices`,

  // Dashboard endpoint
  DASHBOARD: `${API_BASE_URL}/clients/dashboard`,

  // Notifications endpoint
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  MARK_NOTIFICATION_READ: `${API_BASE_URL}/notifications/:id/read`,
  MARK_ALL_NOTIFICATIONS_READ: `${API_BASE_URL}/notifications/mark-all-read`,
  
  // Chat endpoints
  GET_CHAT_SESSIONS: `${API_BASE_URL}/chat/sessions`,
  GET_CHAT_MESSAGES: `${API_BASE_URL}/chat/:sessionId/messages`,
  SEND_MESSAGE: `${API_BASE_URL}/chat/message`,
  MARK_CHAT_AS_READ: `${API_BASE_URL}/chat/read`,
};

export default API_ENDPOINTS;