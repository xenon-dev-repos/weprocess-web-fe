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
        const isNext = step.id === currentStep + 1;
        
        // Special cases for Service Type (step 4) and Payment (step 5)
        const isSpecialStep = step.id === 4 || step.id === 5;
        
        // For special steps, check if all previous steps are complete
        const allPreviousComplete = Array.from({ length: step.id - 1 }, (_, i) => i + 1)
          .every(prevStep => isStepComplete(prevStep));
        
        // Allow clicking if:
        // 1. It's a previous step (can always go back)
        // 2. It's the current step
        // 3. It's the immediate next step when current is complete
        // 4. It's a completed step
        // For special steps (4 and 5), also require all previous steps to be complete
        const isClickable = (
          isPrevious || 
          isCurrent || 
          (isNext && isStepComplete(currentStep)) || 
          (isCompleted && (!isSpecialStep || allPreviousComplete))
        );

        // Opacity rules:
        // - Special steps: 1 only if all previous complete, else 0.6
        // - Next step: 1 if current step is complete, else 0.6
        // - Others: 1 if clickable, else 0.6
        const opacity = isSpecialStep 
          ? (allPreviousComplete ? 1 : 0.6)
          : isNext
            ? (isStepComplete(currentStep) ? 1 : 0.6)
            : (isClickable ? 1 : 0.6);

        return (
          <StepContainer
            key={step.id}
            $active={isCurrent} 
            $completed={isPrevious}
            onClick={() => isClickable && onStepClick(step.id)}
            $clickable={isClickable}
            style={{ opacity }}
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

// export const StepsList = ({ currentStep, stepsData, onStepClick, isStepComplete }) => {
//   const steps = stepsData.map((title, index) => ({
//     id: index + 1,
//     title
//   }));

//   return (
//     <StepsContainer>
//       {steps.map((step) => {
//         const isCompleted = isStepComplete(step.id);
//         const isCurrent = step.id === currentStep;
//         const isPrevious = step.id < currentStep;
        
//         // Allow clicking if:
//         // - It's a previous step (can always go back)
//         // - It's the current step
//         // - It's a completed step where all previous steps are complete
//         const isClickable = isPrevious || isCurrent || isCompleted;

//         return (
//           <StepContainer
//             key={step.id}
//             $active={isCurrent} 
//             $completed={isPrevious}
//             onClick={() => isClickable && onStepClick(step.id)}
//             $clickable={isClickable}
//           >
//             <StepTitle>
//               {step.title}
//             </StepTitle>
//             {isPrevious && <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />}
//           </StepContainer>
//         );
//       })}
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
  background-color: ${props => props.$active ? '#F0F6E3' : 'transparent'};
  // cursor: ${props => props.$clickable ? 'pointer' : 'not-allowed'};
  // opacity: ${props => props.$clickable ? 1 : 0.6};
  cursor: ${props => props.$clickable ? 'pointer' : 'not-allowed'};
  transition: opacity 0.2s ease;
`;

const StepTitle = styled.span`
  font-size: 16px;
  color: #242331;
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
`;