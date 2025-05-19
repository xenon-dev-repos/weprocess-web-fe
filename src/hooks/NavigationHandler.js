// NavigationHandler.js
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useInstruction } from '../contexts/InstructionContext';

export const NavigationHandler = ({ children }) => {
  const { resetFormData } = useInstruction();
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    console.log("resetFormData functions called.")
    resetFormData();
  }, [location.pathname, navigationType, resetFormData]);

  return children;
};