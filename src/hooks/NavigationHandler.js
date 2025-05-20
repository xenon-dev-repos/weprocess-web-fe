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
      // TODO: Used for debugging, remove console.log later
      // console.log("resetFormData functions called.")
      resetFormData();
    }
  }, [location.pathname, navigationType, resetFormData]);

  return children;
};