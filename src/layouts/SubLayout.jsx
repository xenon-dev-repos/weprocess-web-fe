import { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from './MainLayout';
import { Images } from '../assets/images/index.js';

export const SubLayout = ({ children, pageTitle, title, icon  }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <MainLayout>
      <LayoutContainer>

        <LeftSection $drawerOpen={drawerOpen}>
          <DrawerHeader>
            <SettingsTitle>{pageTitle}</SettingsTitle>
            <DrawerCloseButton onClick={() => setDrawerOpen(false)}>
              <ArrowIcon src={Images.icons.arrowLeft} alt="Close drawer" />
            </DrawerCloseButton>
          </DrawerHeader>
          {children[0]}
        </LeftSection>

        <RightSection>
          <MobileMenuButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon src={Images.icons.menuIcon} alt="Menu" />
          </MobileMenuButton>
          
          <RightSectionHeader>
            <IconContainer $width="64px" $height="64px">
              <Icon src={icon } alt="Profile" />
            </IconContainer>
            <RightSectionTitle>{title}</RightSectionTitle>
          </RightSectionHeader>
          
          <RightSectionContent>
            {children[1]}
          </RightSectionContent>
        </RightSection>

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
  min-height: calc(100vh - 80px);
  width: 100%;
  gap: 24px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

const LeftSection = styled.div`
  width: 100%;
  max-width: 384px;
  border-radius: 12px;
  border-left: 1px solid #E5E7EB;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;

  @media (max-width: 1440px) {
    max-width: 360px;
    padding: 18px;
  }

  @media (max-width: 1280px) {
    max-width: 340px;
    padding: 16px;
  }

  @media (max-width: 1024px) {
    max-width: 320px;
    padding: 16px 14px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.$drawerOpen ? '0' : '-100%'};
    height: 100%;
    width: 85%;
    max-width: 320px;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    border-radius: 0;
    padding: 16px;
  }

  @media (max-width: 600px) {
    width: 85%;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    width: 85%;
    max-width: 290px;
    padding: 14px 12px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
//   margin-bottom: 20px;
  padding-bottom: 16px;
//   border-bottom: 1px solid #E5E7EB;
`;

const SettingsTitle = styled.h1`
  font-weight: 500;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

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

const ArrowIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const RightSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 6px 32px;
  height: 112px;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 6px 20px;
    height: 80px;
    gap: 16px;
  }
`;

const RightSectionContent = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RightSectionTitle = styled.h2`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: #121F24;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const IconContainer = styled.div`
  width: ${props => props.$width || '48px'};
  height: ${props => props.$height || '48px'};
  border-radius: 100px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

@media (max-width: 768px) {
    margin-left: 60px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

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