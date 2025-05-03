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

// Fallback route
NOT_FOUND: '*',
};

// Route component mappings
// export const ROUTE_COMPONENTS = {
// [ROUTES.SIGNUP]: 'SignupPage',
// [ROUTES.SIGNIN]: 'SigninPage',
// [ROUTES.FIRM_SETUP]: 'FirmSetupPage',
// [ROUTES.INDIVIDUAL_SETUP]: 'IndividualSetupPage',
// [ROUTES.DASHBOARD]: 'DashboardPage',
// [ROUTES.FORGOT_PASSWORD]: 'ForgotPasswordPage',
// [ROUTES.RESET_PASSWORD]: 'ResetPasswordPage',
// };

// Optional: Create route builder functions
export const buildVerifyOtpRoute = (email) => `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`;
// constants/routes.js
export const buildProfileRoute = (userId) => `${ROUTES.PROFILE}/${userId}`;