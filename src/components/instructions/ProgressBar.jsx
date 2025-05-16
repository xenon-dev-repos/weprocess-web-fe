import React from 'react';
import styled from 'styled-components';
import { useInstruction } from '../../contexts/InstructionContext.jsx';

export const ProgressBar = ({ steps }) => {
  const { currentStep, isSubmitted } = useInstruction();

   let progressPercentage;
  if (currentStep === steps.length && !isSubmitted) {
    progressPercentage = 95; // 5% remaining until submission
  } else if (currentStep === steps.length && isSubmitted) {
    progressPercentage = 100; // Fully complete after submission
  } else {
    progressPercentage = (currentStep / steps.length) * 100;
  }

  return (
    <ProgressBarContainer>
      <ProgressBarBackground>
        <ProgressBarFill $progress={progressPercentage} />
      </ProgressBarBackground>
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 8px;
  background-color: #FFFFFF;
  border-radius: 100px;
  overflow: hidden;

  @media (max-width: 480px) {
    height: 6px;
  }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: #AE8119;
  border-radius: 100px;
  transition: width 0.3s ease;
`;