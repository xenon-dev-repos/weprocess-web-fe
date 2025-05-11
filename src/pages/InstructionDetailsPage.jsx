import React from 'react';
// import { useState, useEffect } from 'react';
// import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { ContentSection, SideBarSection } from '../layouts/SubLayout.jsx';
import { ContentSectionContent, ContentSectionHeader, ContentSectionTitle, LayoutContainer } from '../layouts/AddInstructionLayout.jsx';


const InstructionDetailsPage = () => {
  return (
    <MainLayout title="Instruction Details" isInstructionDetailsPage={true}>
      <LayoutContainer>

        <ContentSection>
          <ContentSectionHeader>
            <ContentSectionTitle>Instruction Details</ContentSectionTitle>
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

export default InstructionDetailsPage;
