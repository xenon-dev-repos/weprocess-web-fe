import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from './MainLayout';
import { Images } from '../assets/images/index.js';
import { ContentSection, SideBarSection } from './SubLayout.jsx';

export const AddInstructionLayout = ({ 
  children, 
  showAddInstructionPageHeader, 
  tabTitle, 
  tabDescription,
  handlePrevStep,
  handleNextStep,
  currentStep,
  stepsConfig,
  stepsData,
  // isSubmitted,
  }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <MainLayout title={'New instruction'} showAddInstructionPageHeader={showAddInstructionPageHeader} currentStep={currentStep} stepsData={stepsData}>
      <LayoutContainer>
        <ContentSection>

          {/* <MobileMenuButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon src={Images.icons.menuIcon} alt="Menu" />
          </MobileMenuButton> */}

          <ContentSectionHeader>
            <ContentSectionTitle>{tabTitle}</ContentSectionTitle>
            <ContentSectionDescription>{tabDescription}</ContentSectionDescription>
          </ContentSectionHeader>
          
          <ContentSectionContent>
            {children[1]}
          </ContentSectionContent>

          <ButtonGroup $noBackBtn={currentStep === 1}>
            {/* <FormButton
              onClick={handlePrevStep} 
              disabled={currentStep === 1}
              style={{backgroundColor: '#E5E5E5', color: '#333333'}}
            >
              Back
            </FormButton>
            <FormButton
              onClick={handleNextStep}
            >
              {currentStep === stepsConfig.length ? 'Confirm Instruction' : 'Next'}
            </FormButton> */}
            <FormButton
              onClick={handlePrevStep} 
              disabled={currentStep === 1}
              style={{backgroundColor: '#E5E5E5', color: '#333333'}}
            >
              <ButtonContent>
              <BackNextArrow src={Images.instructions.BtnArrowLeftIcon} alt="Back" />
                Back
              </ButtonContent>
            </FormButton>

            <FormButton onClick={handleNextStep}>
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

        <SideBarSection $height={'376px'} $drawerOpen={drawerOpen}>
          {/* <DrawerHeader>
            <DrawerCloseButton onClick={() => setDrawerOpen(false)}>
              <ArrowIcon src={Images.icons.arrowLeft} alt="Close drawer" />
            </DrawerCloseButton>
          </DrawerHeader> */}

          {children[0]}
        </SideBarSection>

        <DrawerOverlay 
          $drawerOpen={drawerOpen} 
          onClick={() => setDrawerOpen(false)}
        />
      </LayoutContainer>
    </MainLayout>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 24px;
  overflow: hidden;
  position: relative;
  // min-height: calc(100vh - 160px);

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
    flex-direction: column;
    gap: 16px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

const ContentSectionContent = styled.div`
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

const ContentSectionHeader = styled.div`
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

/* Commented out but kept for future use */
const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 20px;
  // padding-bottom: 16px;
  // border-bottom: 1px solid #E5E7EB;
`;

/* Commented out but kept for future use */
const DrawerCloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

/* Commented out but kept for future use */
const ArrowIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const ContentSectionTitle = styled.h2`
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

/* Unused but kept for future reference */
const CancelButton = styled.button`
  width: 105px;
  height: 56px;
  border-radius: 16px;
  padding: 8px 24px;
  background-color: transparent;
  color: #656565;
  border: 1px solid #656565;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(101, 101, 101, 0.1);
  }

  @media (max-width: 768px) {
    width: 95px;
    height: 50px;
    font-size: 14px;
    padding: 6px 20px;
  }

  @media (max-width: 480px) {
    width: 85px;
    height: 46px;
    font-size: 13px;
    padding: 5px 16px;
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
    background-color: #999;
    cursor: not-allowed;
    display: none;
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

/* Commented out but kept for future use */
const MobileMenuButton = styled.button`
  display: none;
  position: absolute;
  top: 17px;
  left: 24px;
  z-index: 1;
  background: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

/* Commented out but kept for future use */
const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
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