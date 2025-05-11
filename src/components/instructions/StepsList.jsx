import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images/index.js';

const steps = [
  { id: 1, title: 'Uploaded documents' },
  { id: 2, title: 'Serve type' },
  { id: 3, title: 'Recipient details' },
  { id: 4, title: 'Service type' },
  { id: 5, title: 'Payment method' },
  { id: 6, title: 'Confirmation' },
];

export const StepsList = ({ currentStep, isSubmitted }) => {
  return (
    <StepsContainer>
      {steps.map((step) => (
        <StepContainer
          key={step.id}
          $active={step.id === currentStep} 
          $completed={step.id < currentStep}
        >
          <StepTitle>
            {step.title}
          </StepTitle>
          {(step.id < currentStep || isSubmitted) && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />}
        </StepContainer>
      ))}
    </StepsContainer>
  );
};

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StepContainer = styled.div`
  height: 48px;
  border-radius: 16px;
  gap: 16px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.$active ? '#F0F6E3' : 'transparent'};
`;

const StepTitle = styled.span`
  font-size: 16px;
  color: #242331;
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
`;