import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images/index.js';

export const ProgressBar = ({ steps, currentStep, isSubmitted }) => {
  let progressPercentage;
  if (currentStep === steps.length && !isSubmitted) {
    progressPercentage = 95; // 5% remaining for confimation step
  } else {
    progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  }

  return (
    <ProgressBarContainer>
      <ProgressBarBackground>
        <ProgressBarFill $progress={progressPercentage} />
      </ProgressBarBackground>
      {/* <StepLabelsContainer>
        {steps.map((step, index) => (
          <StepLabelsAndIconContainer key={index}>
            {index + 1 < currentStep || (index + 1 === steps.length && isSubmitted) ? (
              <CheckIcon src={Images.instructions.checkIcon} alt="Completed" />
            ) : null}
            <StepLabel $active={index + 1 <= currentStep}>
              {step}
            </StepLabel>
          </StepLabelsAndIconContainer>
        ))}
      </StepLabelsContainer> */}
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

const StepLabelsContainer = styled.div`
  display: none;
  justify-content: space-between;
  width: 100%;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const StepLabelsAndIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row;

  @media (max-width: 768px) {
    gap: 2px;
  }

  @media (max-width: 480px) {
    gap: 1px;
  }
`;

const StepLabel = styled.span`
  font-size: 12px;
  color: ${props => props.$active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};

  @media (min-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    font-size: 11px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
  }

  @media (max-width: 375px) {
    font-size: 7px;
  }
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: 1440px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1280px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1024px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 375px) {
    width: 12px;
    height: 12px;
  }
`;