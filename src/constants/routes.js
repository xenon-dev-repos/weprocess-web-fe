export const ROUTES = {
// Public routes
ROOT: '/',
SIGNUP: '/signup',
SIGNIN: '/signin',
FORGOT_PASSWORD: '/forgot-password',
RESET_PASSWORD: '/reset-password',

// Setup routes
FIRM_SETUP: '/firm-setup',
INDIVIDUAL_SETUP: '/individual-setup',

// App routes
DASHBOARD: '/dashboard',
INSTRUCTIONS: '/instructions',
INVOICES: '/invoices',
PROFILE: '/settings',

// Fallback route
NOT_FOUND: '*',
};


// Optional: Create route builder functions
export const buildVerifyOtpRoute = (email) => `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`;
// constants/routes.js
export const buildProfileRoute = (userId) => `${ROUTES.PROFILE}/${userId}`;