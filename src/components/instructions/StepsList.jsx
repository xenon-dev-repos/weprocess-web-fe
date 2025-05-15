import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images/index.js';


export const StepsList = ({ currentStep, stepsData, onStepClick, isStepComplete, isSubmitted }) => {
  const steps = stepsData.map((title, index) => ({
    id: index + 1,
    title
  }));

  // Find the first incomplete step
  const firstIncompleteStep = steps.find(
    step => !isStepComplete(step.id)
  )?.id || steps.length + 1;

  return (
    <StepsContainer>
      {steps.map((step) => {
        const isClickable = step.id <= firstIncompleteStep;
        // Hide checkmark for last step until submitted
        const showCheckmark = isStepComplete(step.id) && 
                            (step.id !== steps.length || isSubmitted);
        
        return (
          <StepContainer
            key={step.id}
            $active={step.id === currentStep} 
            $completed={isStepComplete(step.id)}
            onClick={() => isClickable && onStepClick(step.id)}
            $clickable={isClickable}
          >
            <StepTitle>
              {step.title}
            </StepTitle>
            {/* {isStepComplete(step.id) && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />} */}
             {showCheckmark && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />}
          </StepContainer>
        );
      })}
    </StepsContainer>
  );
};

// export const StepsList = ({ currentStep, stepsData, onStepClick, isStepComplete }) => {

//   const steps = stepsData.map((title, index) => ({
//     id: index + 1,
//     title
//   }));

//   return (
//     <StepsContainer>
//       {steps.map((step) => (
//         <StepContainer
//           key={step.id}
//           $active={step.id === currentStep} 
//           $completed={isStepComplete(step.id)}
//           onClick={() => onStepClick(step.id)}
//           $clickable={step.id <= currentStep || isStepComplete(step.id)}
//         >
//           <StepTitle>
//             {step.title}
//           </StepTitle>
//           {isStepComplete(step.id) && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />}
//         </StepContainer>
//       ))}
//     </StepsContainer>
//   );
// };

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
  // background-color: ${props => props.$active ? '#F0F6E3' : 'transparent'};
  // cursor: pointer;
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