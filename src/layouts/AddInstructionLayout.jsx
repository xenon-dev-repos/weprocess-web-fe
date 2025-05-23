import React from 'react';
import styled from 'styled-components';
import { MainLayout } from './MainLayout';
import { Images } from '../assets/images/index.js';
import { ContentSection, SideBarSectionAddInstruction } from './SubLayout.jsx';

export const AddInstructionLayout = ({ 
  children, 
  isAddInstructionPage, 
  tabTitle, 
  tabDescription,
  handlePrevStep,
  handleNextStep,
  currentStep,
  stepsConfig,
  stepsData,
  // handleInstructionServeSubmit,
  isNextDisabled,
  isLoading,
  }) => {

  return (
    <MainLayout title={'New instruction'} isAddInstructionPage={isAddInstructionPage} currentStep={currentStep} stepsData={stepsData}>
      <LayoutContainer>
        
        <ContentSection>
          <ContentSectionHeader>
            <ContentSectionTitle>{tabTitle}</ContentSectionTitle>
            <ContentSectionDescription>{tabDescription}</ContentSectionDescription>
          </ContentSectionHeader>
          
          <ContentSectionContent>
            {children[1]}
          </ContentSectionContent>

          <ButtonGroup $noBackBtn={currentStep === 1}>
            {currentStep !== 1 && (
              <FormButton
                onClick={handlePrevStep}
                style={{backgroundColor: '#E5E5E5', color: '#333333'}}
              >
                <ButtonContent>
                  <BackNextArrow src={Images.instructions.BtnArrowLeftIcon} alt="Back" />
                  Back
                </ButtonContent>
              </FormButton>
            )}

            <FormButton 
              onClick={handleNextStep}
              disabled={isNextDisabled || isLoading}
              $isNext={true}
            >
              <ButtonContent>
                {currentStep === stepsConfig.length ? 'Confirm Instruction' : (
                  <>
                    Next
                    <BackNextArrow src={Images.instructions.BtnArrowRightIcon} alt="Back" />
                  </>
                )}
              </ButtonContent>
            </FormButton>
          </ButtonGroup>
        </ContentSection>

        <SideBarSectionAddInstruction $height={'376px'}>
          {children[0]}
        </SideBarSectionAddInstruction>

      </LayoutContainer>
    </MainLayout>
  );
};

export const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 24px;
  overflow: hidden;
  position: relative;

  @media (max-width: 1440px) {
    gap: 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
  }

  @media (max-width: 1024px) {
    gap: 18px;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 16px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

export const ContentSectionContent = styled.div`
  padding: 0px 24px 24px 24px;
  overflow-y: auto;
  flex-grow: 1;

  @media (max-width: 1440px) {
    padding: 0px 22px 22px 22px;
  }

  @media (max-width: 1280px) {
    padding: 0px 20px 20px 20px;
  }

  @media (max-width: 1024px) {
    padding: 0px 18px 18px 18px;
  }

  @media (max-width: 768px) {
    padding: 0px 16px 16px 16px;
  }

  @media (max-width: 480px) {
    padding: 0px 14px 14px 14px;
  }
`;

export const ContentSectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding: 6px 24px;
  height: 112px;
  // border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 1440px) {
    padding: 6px 22px;
    height: 106px;
  }

  @media (max-width: 1280px) {
    padding: 6px 20px;
    height: 100px;
  }

  @media (max-width: 1024px) {
    padding: 6px 18px;
    height: 96px;
  }

  @media (max-width: 768px) {
    padding: 6px 16px;
    height: 90px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px 14px;
    height: 84px;
    gap: 10px;
  }
`;

export const ContentSectionTitle = styled.h2`
  color: #242331;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;

  @media (max-width: 1440px) {
    font-size: 19px;
  }

  @media (max-width: 1280px) {
    font-size: 18px;
  }

  @media (max-width: 1024px) {
    font-size: 17px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ContentSectionDescription = styled.h2`
  color: #656565;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

  @media (max-width: 1440px) {
    font-size: 15px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: ${props => props.$noBackBtn ? 'flex-end' : 'space-between'};
  gap: 16px;
  padding: 0px 24px 24px 24px;

  @media (max-width: 1440px) {
    padding: 0px 22px 22px 22px;
  }

  @media (max-width: 1280px) {
    padding: 0px 20px 20px 20px;
  }

  @media (max-width: 1024px) {
    padding: 0px 18px 18px 18px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    padding: 0px 16px 16px 16px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 0px 14px 14px 14px;
    gap: 10px;
  }
`;

export const FormButton = styled.button`
  display: block;
  min-width: 105px;
  height: 56px;
  border-radius: 16px;
  padding: 8px 24px;
  background-color: var(--color-primary-500);
  color: var(--color-text-secondary);
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-primary-400);
  }

  &:disabled {
    opacity: ${props => props.$isNext ? '0.3' : '1'};
    color: var(--color-text-secondary);
    cursor: not-allowed;
  }

  @media (max-width: 1440px) {
    width: 100px;
    height: 52px;
    font-size: 15px;
    padding: 7px 22px;
  }

  @media (max-width: 1280px) {
    width: 95px;
    height: 50px;
    font-size: 14px;
    padding: 6px 20px;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 48px;
    font-size: 14px;
    padding: 6px 18px;
  }

  @media (max-width: 480px) {
    width: 85px;
    height: 44px;
    font-size: 13px;
    padding: 5px 16px;
  }
`;

const DrawerOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  opacity: ${props => props.$drawerOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.$drawerOpen ? 'auto' : 'none'};

  @media (max-width: 768px) {
    display: block;
  }
`;

const BackNextArrow = styled.img`
  width: 12;
  height: 24;
  angle: -0 deg;

  @media (max-width: 768px) {
    width: 10;
    height: 20;
  }

  @media (max-width: 480px) {
    width: 8;
    height: 16;
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;
