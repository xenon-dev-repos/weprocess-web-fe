import React from 'react';
// import { useState, useEffect } from 'react';
// import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { ContentSection, SideBarSection } from '../layouts/SubLayout.jsx';
import { ContentSectionContent, ContentSectionHeader, ContentSectionTitle, LayoutContainer } from '../layouts/AddInstructionLayout.jsx';


const InvoiceDetailsPage = () => {
  return (
    <MainLayout title={'Invoice Details'} isInvoiceDetailsPage={true}>
      <LayoutContainer>

        <ContentSection>
          <ContentSectionHeader>
            <ContentSectionTitle>Invoice Details</ContentSectionTitle>
            {/* <ContentSectionDescription>{tabDescription}</ContentSectionDescription> */}
          </ContentSectionHeader>
          
          <ContentSectionContent>
            CONTENT
          </ContentSectionContent>
        </ContentSection>

        <SideBarSection $height={'376px'} $drawerOpen={false}>
          SIDE
        </SideBarSection>
      </LayoutContainer>
    </MainLayout>
  );
};

export default InvoiceDetailsPage;
