import React from 'react';
import styled from 'styled-components';
import { useInstruction } from '../../contexts/InstructionContext';

export const StepValidation = ({ step, children }) => {
  const { isStepComplete, currentStep } = useInstruction();
  
  if (currentStep !== step) return null;
  
  return (
    <ValidationContainer>
      {children}
      {!isStepComplete(step) && (
        <ErrorMessage>
          Please complete all required fields before proceeding
        </ErrorMessage>
      )}
    </ValidationContainer>
  );
};

const ValidationContainer = styled.div`
  width: 100%;
`;

const ErrorMessage = styled.div`
  width: 100%;
  color: #ff4d4f;
  margin-top: 16px;
  padding: 8px 16px;
  background: #fff2f0;
  border-radius: 4px;
  border: 1px solid #ffccc7;
  display: flex;
  justify-content: center;
`;