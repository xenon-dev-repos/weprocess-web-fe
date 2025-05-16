import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images/index.js';


export const StepsList = ({ currentStep, stepsData, onStepClick, isStepComplete }) => {
  const steps = stepsData.map((title, index) => ({
    id: index + 1,
    title
  }));

  return (
    <StepsContainer>
      {steps.map((step) => {
        const isCompleted = isStepComplete(step.id);
        const isCurrent = step.id === currentStep;
        const isPrevious = step.id < currentStep;
        
        // Allow clicking if:
        // - It's a previous step (can always go back)
        // - It's the current step
        // - It's a completed step where all previous steps are complete
        const isClickable = isPrevious || isCurrent || isCompleted;

        return (
          <StepContainer
            key={step.id}
            $active={isCurrent} 
            $completed={isPrevious}
            onClick={() => isClickable && onStepClick(step.id)}
            $clickable={isClickable}
          >
            <StepTitle>
              {step.title}
            </StepTitle>
            {isPrevious && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />}
          </StepContainer>
        );
      })}
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
  cursor: ${props => props.$clickable ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.$clickable ? 1 : 0.6};
`;

const StepTitle = styled.span`
  font-size: 16px;
  color: #242331;
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
`;