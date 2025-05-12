import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images/index.js';



export const StepsList = ({ currentStep, isSubmitted, stepsData }) => {

  const steps = [
    { id: 1, title: stepsData[0] },
    { id: 2, title: stepsData[1] },
    { id: 3, title: stepsData[2] },
    { id: 4, title: stepsData[3] },
    { id: 5, title: stepsData[4] },
    { id: 6, title: stepsData[5] },
  ];

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