import React, { useEffect } from 'react';
// import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { ContentSection, SideBarSection, SideBarSectionRight } from '../layouts/SubLayout.jsx';
import { ContentSectionHeader, ContentSectionTitle } from '../layouts/AddInstructionLayout.jsx';
import { useInstruction } from '../contexts/InstructionContext.jsx';
import { SharedInstructionInvoiceDetails } from '../components/instructions/SharedInstructionInvoiceDetails.jsx';
import LoadingOnPage from '../components/shared/LoadingOnPage.jsx';


const InstructionDetailsPage = () => {
  const { formData, fetchInvoiceById, currentInvoiceData, isLoading } = useInstruction();

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        await fetchInvoiceById('5');
      } catch (error) {
        console.error(error, 'Error accured while geting invoice data.')
      }
    };
    
    loadInvoice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout title="Invoice Details" isInvoiceDetailsPage={true}>
      <LayoutContainer>
        {isLoading && <LoadingOnPage />}
        {/* LEFT SECTION */}
        <ContentSection>
          <ContentSectionHeader style={{height: '80px'}}>
              <ContentSectionTitle>Invoice Details</ContentSectionTitle>
          </ContentSectionHeader>

          <InstructionsDetailMainContainer>
            <SharedInstructionInvoiceDetails formData={formData} isInvoiceDetails={true} currentInvoiceData={currentInvoiceData}/>
          </InstructionsDetailMainContainer>
        </ContentSection>

      </LayoutContainer>
    </MainLayout>
  );
};

export const InstructionsDetailMainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 0px 24px 24px 24px;
  

  @media (max-width: 1440px) {
    gap: 22px;
    padding: 0px 22px 22px 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
    padding: 0px 20px 20px 20px;
  }

  @media (max-width: 1024px) {
    gap: 18px;
    padding: 0px 18px 18px 18px;
  }

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0px 16px 16px 16px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    padding: 0px 14px 14px 14px;
  }
`;

export const SideBarSectionRightMain = styled.div`
  width: 100%;
  max-width: 440px;
  height: auto;
  // max-height: 
  border-radius: 20px;
  gap: 16px;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;
  box-size: border-box;
  align-items: center;

  @media (max-width: 1440px) {
    // padding: 18px;
    // height: 372px;
  }

  @media (max-width: 1280px) {
    // padding: 16px;
    // height: 358px;
  }

  @media (max-width: 1024px) {
    // padding: 16px;
    // height: 330px;
  }

  @media (max-width: 768px) {
    // padding: 16px;
    // height: auto;
  }

  @media (max-width: 480px) {
    // width: 100%;
    // padding: 14px;
  }
`;

export const SideBarSectionSecond = styled.div`
  width: 100%;
  max-width: 440px;
    height: auto;
  max-height: ${props => props.$height ? props.$height : 'auto'};
  border-radius: 20px;
  // padding: 24px;
  gap: 16px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;
  box-size: border-box;
  align-items: center;

  @media (max-width: 1440px) {
    // padding: 18px;
    // height: 372px;
  }

  @media (max-width: 1280px) {
    padding: 16px;
    height: 358px;
  }

  @media (max-width: 1024px) {
    padding: 16px;
    height: 330px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    height: auto;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px;
  }
`;

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
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

export default InstructionDetailsPage;
