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
const navigateToInstructionsDetails = (options) => {navigateTo(`${ROUTES.INSTRUCTION_DETAILS}/${options.state['WPR no.']}`, options);};
const navigateToInvoices = () => navigateTo(ROUTES.INVOICES);
const navigateToInvoicesDetails = (options) => {navigateTo(`${ROUTES.INVOICE_DETAILS}/${options.state['WPR no.']}`, options);};
const navigateToAddInstruction = () => navigateTo(ROUTES.ADD_INSTRUCTION);
const navigateToChat = () => navigateTo(ROUTES.CHAT);

// Special routes
const navigateToRoot = () => navigateTo(ROUTES.ROOT);
const navigateToNotFound = () => navigateTo(ROUTES.NOT_FOUND);

// Route builders
const navigateToVerifyOtp = (email) => navigateTo(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`);


  const handleNavigationFromTableRow = (rowData, isInstruction = false) => {
    if (isInstruction) {
        navigateToInstructionsDetails({
            state: {
                'WPR no.': rowData.wpr,
                "Recipient's name": rowData.recipientName,
                "Service type": rowData.type
            }
        });
    } else {
      navigateToInvoicesDetails({
          state: {
              'WPR no.': rowData.id,
              "Recipient's name": rowData.recipientName,
              "Service type": rowData.type
          }
      });
    }
  };

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
  navigateToInstructionsDetails,
  navigateToInvoices,
  navigateToInvoicesDetails,
  navigateToAddInstruction,
  navigateToChat,
  navigateToRoot,
  navigateToNotFound,
  navigateToVerifyOtp,

  handleNavigationFromTableRow,
};
};