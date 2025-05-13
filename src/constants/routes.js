export const ROUTES = {
// Public routes
SIGNUP: '/signup',
SIGNIN: '/signin',
FORGOT_PASSWORD: '/forgot-password',
RESET_PASSWORD: '/reset-password',
FIRM_SETUP: '/firm-setup',
INDIVIDUAL_SETUP: '/individual-setup',

// App routes
ROOT: '/',
DASHBOARD: '/dashboard',
INSTRUCTIONS: '/instructions',
INVOICES: '/invoices',
SETTINGS: '/settings',
ADD_INSTRUCTION: '/add-new-instruction',
INSTRUCTION_DETAILS: '/instruction-details',
INVOICE_DETAILS: '/invoice-details',
NOTIFICATIONS: '/notifications',

// Fallback route
NOT_FOUND: '*',
};


// Optional: Create route builder functions
export const buildVerifyOtpRoute = (email) => `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`;
// constants/routes.js
export const buildProfileRoute = (userId) => `${ROUTES.PROFILE}/${userId}`;