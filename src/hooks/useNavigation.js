import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { clearError } = useAuth();

  const navigateTo = (url, options) => {
    clearError();
    navigate(url, options);
  };

// Public routes
const navigateToSignUp = () => navigateTo(ROUTES.SIGNUP);
const navigateToSignIn = () => navigateTo(ROUTES.SIGNIN);
const navigateToForgotPassword = () => navigateTo(ROUTES.FORGOT_PASSWORD);
const navigateToResetPassword = () => navigateTo(ROUTES.RESET_PASSWORD);

// Setup routes
const navigateToFirmSetup = () => navigateTo(ROUTES.FIRM_SETUP);
const navigateToIndividualSetup = () => navigateTo(ROUTES.INDIVIDUAL_SETUP);

// App routes
const navigateToDashboard = () => navigateTo(ROUTES.DASHBOARD);
const navigateToInstructions = () => navigateTo(ROUTES.INSTRUCTIONS);
const navigateToInvoices = () => navigateTo(ROUTES.INVOICES);
const navigateToChat = () => navigateTo(ROUTES.CHAT);

// Special routes
const navigateToRoot = () => navigateTo(ROUTES.ROOT);
const navigateToNotFound = () => navigateTo(ROUTES.NOT_FOUND);

// Route builders
const navigateToVerifyOtp = (email) => 
  navigateTo(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`);

return {
  navigateTo,
  navigateToSignUp,
  navigateToSignIn,
  navigateToForgotPassword,
  navigateToResetPassword,
  navigateToFirmSetup,
  navigateToIndividualSetup,
  navigateToDashboard,
  navigateToInstructions,
  navigateToInvoices,
  navigateToChat,
  navigateToRoot,
  navigateToNotFound,
  navigateToVerifyOtp,
};
};