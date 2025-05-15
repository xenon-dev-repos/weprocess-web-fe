import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
// import { useInstruction } from '../contexts/InstructionContext';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { clearError } = useAuth();
  // const { resetFormData } = useInstruction();

  const navigateTo = (url, options) => {
    clearError();
    // TODO: Form Data must be restoreTextDirection, currently facing issue of using context not inside provider. I'll fix this.
    // resetFormData();
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
const navigateToInstructionsDetails = (options) => {navigateTo(ROUTES.INSTRUCTION_DETAILS, options);};
const navigateToInvoices = () => navigateTo(ROUTES.INVOICES);
const navigateToInvoicesDetails = (options) => {navigateTo(ROUTES.INVOICE_DETAILS, options);};
const navigateToAddInstruction = () => navigateTo(ROUTES.ADD_INSTRUCTION);

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
              'WPR no.': rowData.wpr,
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
  navigateToRoot,
  navigateToNotFound,
  navigateToVerifyOtp,

  handleNavigationFromTableRow,
};
};