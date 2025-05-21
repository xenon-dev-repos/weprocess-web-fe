// NavigationHandler.js
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useInstruction } from '../contexts/InstructionContext';

export const NavigationHandler = ({ children }) => {
  const { resetFormData } = useInstruction();
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (resetFormData && typeof resetFormData === 'function') {
      // This will reset the form data when the user navigates to a different page, necessary for the form to be reset
      resetFormData();
    }
  }, [location.pathname, navigationType, resetFormData]);

  return children;
};