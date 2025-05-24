import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import WeProcessLogoIcon from '../assets/images/dashboard/weprocess-logo-icon.svg';
import SearchIcon from '../assets/images/dashboard/search-icon.svg';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import MessageIcon from '../assets/images/dashboard/message-icon.svg';
import { useNavigation } from '../hooks/useNavigation';
import { PageHeader } from '../components/shared/PageHeader';
import { ProfileDropdown } from '../components/shared/ProfileDropdown';
import { useAuth } from '../contexts/AuthContext';
import { Images } from '../assets/images/index.js';
import NotificationModal from '../components/shared/NotificationModal';
import NotificationBadge from '../components/NotificationBadge';

export const MainLayout = ({ 
  children,
  title,
  isDashboardPage = false,
  isInstructionsPage = false,
  isInvoicePage = false,
  isAddInstructionPage = false,
  isInstructionDetailsPage = false,
  isInvoiceDetailsPage = false,
  isSearchPage = false,
  isNotificationPage = false,
  isChatPage = false,
  showShortHeader = false,
  filterButtons,
  onFilterChange,
  currentStep='1',
  stepsData=[],
  instructionData,
  invoiceData,
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(''); 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user } = useAuth();
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const avatarRef = useRef(null);
  const notificationIconRef = useRef(null);
  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'U';
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const {
    navigateToDashboard,
    navigateToInstructions,
    navigateToInvoices,
    navigateToChat,
    navigateToAddInstruction
  } = useNavigation();

  const handleNavigation = (path, linkName) => {
    setActiveLink(linkName);
    path();
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    handleButtonSelect('search');
    // Add any search-specific logic here if needed
  };

  const toggleNotificationDropdown = (e) => {
    e.stopPropagation();
    if (isNotificationPage) return;
    handleButtonSelect('notification');
    setNotificationModalOpen(prev => !prev);
  };

  // This effect will reset the selected button when the notification modal is closed
  useEffect(() => {
    if (!notificationModalOpen && !isNotificationPage) {
      setSelectedButton(null);
    }
  }, [notificationModalOpen, isNotificationPage]);

  const handleChatClick = (e) => {
    e.stopPropagation();
    handleButtonSelect('message');
    localStorage.setItem('navigatingToChat', 'true');
    
    // Clear notification intervals and timeouts
    const existingIntervals = window.notificationIntervals || [];
    existingIntervals.forEach(intervalId => clearInterval(intervalId));
    
    if (window.notificationTimeouts) {
      window.notificationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    }
    
    handleNavigation(navigateToChat, 'Chat');
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    toggleProfileDropdown(e);
  };
  
  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(prev => !prev);
  };

  const handleButtonSelect = (buttonName) => {
    setSelectedButton(prev => prev === buttonName ? null : buttonName);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path.includes('/dashboard')) {
      setActiveLink('Dashboard');
    } else if (path.includes('/instructions')) {
      setActiveLink('Instructions');
    } else if (path.includes('/invoices')) {
      setActiveLink('Invoices');
    } else if (path.includes('/chat')) {
      setSelectedButton('message');
    } else if (path.includes('/notifications')) {
      setSelectedButton('notification');
    } else if (path.includes('/search')) {
      setSelectedButton('search');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          !navRef.current?.contains(event.target) && 
          !toggleRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <AppContainer>
      <AppHeader $applyMinHeight={isDashboardPage || isInstructionsPage || isInstructionDetailsPage || isInvoicePage || isInvoiceDetailsPage || isAddInstructionPage} $shortHeader={showShortHeader}>
        <MainHeader>
          <LogoContainer>
            <MobileMenuToggle ref={toggleRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </MobileMenuToggle>

            {(isInstructionDetailsPage || isInvoiceDetailsPage) ?
              <Logo onClick={isInstructionDetailsPage ? navigateToInstructions : navigateToInvoices}>
                <LogoCircle>
                  <BackIcon src={Images.instructions.backIcon} alt="Logo" />
                </LogoCircle>
                <LogoName>Back</LogoName>
              </Logo>
              :
              <Logo onClick={navigateToDashboard}>
              <LogoCircle>
                <LogoIcon src={WeProcessLogoIcon} alt="Logo" />
              </LogoCircle>
              <LogoName>WeProcess</LogoName>
              </Logo>
            }
          </LogoContainer>

          <Navigation ref={navRef} $mobileMenuOpen={mobileMenuOpen}>
            <NavLink 
              $active={activeLink === 'Dashboard'} 
              onClick={() => handleNavigation(navigateToDashboard, 'Dashboard')}
            >
              Dashboard
            </NavLink>
            <NavLink 
              $active={activeLink === 'Instructions'} 
              onClick={() => handleNavigation(navigateToInstructions, 'Instructions')}
            >
              Instructions
            </NavLink>
            <NavLink 
              $active={activeLink === 'Invoices'} 
              onClick={() => handleNavigation(navigateToInvoices, 'Invoices')}
            >
              Invoices
            </NavLink>
          </Navigation>

          <UserActions>
            <IconButton
              className={ isSearchPage || selectedButton === 'search' ? 'selected' : ''}
              onClick={handleSearchClick}
            >
              <IconImg src={SearchIcon} alt="Search" />
            </IconButton>

            <IconButton 
              ref={notificationIconRef} 
              className={isNotificationPage || selectedButton === 'notification' ? 'selected' : ''}
              onClick={toggleNotificationDropdown}
              style={{ position: 'relative' }}
            >
              <IconImg src={NotificationIcon} alt="Notifications" />
              <NotificationBadge />
            </IconButton>
            <NotificationModal 
              open={notificationModalOpen}
              onClose={() => setNotificationModalOpen(false)}
              anchorEl={notificationIconRef}
            />

            <IconButton 
              className={isChatPage || selectedButton === 'message' ? 'selected' : ''}
              onClick={handleChatClick}
            >
              <IconImg src={MessageIcon} alt="Messages" />
            </IconButton>
            <AvatarCircle 
              ref={avatarRef}
              onClick={handleAvatarClick}
            >
              {firstLetter}
            </AvatarCircle>
            {showProfileDropdown && (
              <ProfileDropdown 
                avatarRef={avatarRef} 
                onClose={() => setShowProfileDropdown(false)} 
              />
            )}
          </UserActions>
        </MainHeader>
        
        {isDashboardPage && (
          <DashboardHeader>
            <Title>Good Morning, {user?.name.split(' ')[0] || 'User'}!</Title>
            <ButtonContainer>
              <NewButton onClick={navigateToAddInstruction}>
                <span>+</span> New Instruction
              </NewButton>
            </ButtonContainer>
          </DashboardHeader>
        )}

        {isInstructionsPage &&
          <DashboardHeaderInstructions>
            <PageHeader
              title={title}
              filterButtons={filterButtons} 
              onFilterChange={onFilterChange} 
            />
          <ButtonContainer>
            <NewButton onClick={navigateToAddInstruction}>
              <span>+</span> New Instruction
            </NewButton>
          </ButtonContainer>
          </DashboardHeaderInstructions>
        }

        {isInvoicePage &&
          <DashboardHeader style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <PageHeader
              title={title} 
              filterButtons={filterButtons} 
              onFilterChange={onFilterChange} 
            />
          </DashboardHeader>
        }

        {isAddInstructionPage &&
          <DashboardHeader style={{flexDirection: 'column'}}>
            <PageHeader
              title={title} 
              filterButtons={filterButtons} 
              onFilterChange={onFilterChange}
              stepsData={stepsData}
              currentStep={currentStep}
              isAddInstruction={true}
            />
          </DashboardHeader>
        }

        {isInstructionDetailsPage && (
          <DashboardHeader>
          {instructionData && (
            <Title>
              #{instructionData.id} | {instructionData.title}
            </Title>
          )}
              
            {/* <Title>#5102 | Serve to Alex</Title> */}
          </DashboardHeader>
        )}

        {isInvoiceDetailsPage && (
          <DashboardHeader>
            {invoiceData && (
              <Title>
                #{invoiceData.id} | {invoiceData.title}
              </Title>
            )}
          </DashboardHeader>
        )}

      </AppHeader>
      
      <PageContent>
        {children}
      </PageContent>

      {/* <ModalContainer>
      <NotificationModal 
        open={notificationModalOpen} 
        onClose={() => setNotificationModalOpen(false)}
        anchorEl={notificationIconRef}
      />
      </ModalContainer> */}
    </AppContainer>
  );
};

const ModalContainer = styled.div`
    position: absolute;
    right: 35px;
    top: 75px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 1001;
`;


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F5F5;
`;

const AppHeader = styled.header`
  background-color: var(--color-primary-500);
  color: white;
  max-width: 1728px;
  min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '314px' : 'auto'};
  width: calc(100% - 48px);
  margin: 24px auto 0;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${props => props.$shortHeader ? '20px 40px' : '40px'};
  
  @media (max-width: 1440px) {
    width: calc(100% - 40px);
    margin: 22px auto 0;
    border-radius: 18px;
    padding: ${props => props.$shortHeader ? '18px 36px' : '36px'};
    min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '300px' : 'auto'};
  }
  
  @media (max-width: 1280px) {
    width: calc(100% - 36px);
    margin: 20px auto 0;
    border-radius: 16px;
    padding: ${props => props.$shortHeader ? '16px 32px' : '32px'};
    min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '280px' : 'auto'};
  }
  
  @media (max-width: 1024px) {
    width: calc(100% - 32px);
    margin: 18px auto 0;
    padding: ${props => props.$shortHeader ? '15px 30px' : '30px'};
    min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '260px' : 'auto'};
  }
  
  @media (max-width: 768px) {
    width: calc(100% - 28px);
    margin: 16px auto 0;
    border-radius: 14px;
    padding: ${props => props.$shortHeader ? '14px 24px' : '24px'};
    min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '240px' : 'auto'};
  }
  
  @media (max-width: 480px) {
    width: calc(100% - 24px);
    margin: 14px auto 0;
    border-radius: 12px;
    padding: ${props => props.$shortHeader ? '12px 16px' : '16px'};
    min-height: ${props => props.$shortHeader ? 'auto' : props.$applyMinHeight ? '220px' : 'auto'};
  }
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 1440px) {
    gap: 12px;
  }
  
  @media (max-width: 1280px) {
    gap: 10px;
  }
  
  @media (max-width: 1024px) {
    flex-wrap: wrap;
    height: auto;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    gap: 14px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DashboardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary-500);
  
  @media (max-width: 1440px) {
    gap: 20px;
  }
  
  @media (max-width: 1280px) {
    gap: 18px;
  }
  
  @media (max-width: 1024px) {
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const DashboardHeaderInstructions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary-500);
  
  @media (max-width: 1440px) {
    gap: 20px;
  }
  
  @media (max-width: 1280px) {
    gap: 18px;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const LogoCircle = styled.div`
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1280px) {
    width: 55px;
    height: 55px;
  }

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const LogoIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;

  @media (max-width: 1280px) {
    width: 55px;
    height: 55px;
  }

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 1280px) {
    width: 22px;
    height: 22px;
    
    &:hover {
      transform: scale(1.15);
    }
  }

  @media (max-width: 1024px) {
    width: 20px;
    height: 20px;
    
    &:hover {
      transform: scale(1.2);
    }
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    
    &:hover {
      transform: scale(1.25);
    }
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    
    &:hover {
      transform: scale(1.3);
    }
  }
`;

const LogoName = styled.span`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1280px) {
    gap: 10px;
  }

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 1024px) {
    display: block;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    padding: 5px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 8px;
  
  @media (max-width: 1024px) {
    position: fixed;
    top: 100px;
    left: 40px;
    flex-direction: column;
    width: auto;
    min-width: 180px;
    background-color: var(--color-neutral-100);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    display: ${props => props.$mobileMenuOpen ? 'flex' : 'none'};
    gap: 6px;
    border: 1px solid var(--color-neutral-200);
  }

  @media (max-width: 768px) {
    top: 90px;
    left: 30px;
    min-width: 160px;
    padding: 10px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    top: 90px;
    left: 23px;
    min-width: 140px;
    padding: 8px;
    border-radius: 12px;
  }
`;

const NavLink = styled.a`
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  min-width: 120px;
  width: auto;
  height: 48px;
  border-radius: 16px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  
  ${props => props.$active ? `
    font-weight: 700;
    color: #FFFFFF;
    background-color: #FFFFFF1A;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  ` : `
    font-weight: 400;
    color: #E5E5E5;
    background-color: transparent;
  `}
  
  &:hover {
    background-color: #FFFFFF1A;
  }
  
  @media (max-width: 1280px) {
    min-width: 110px;
    padding: 12px 18px;
    height: 44px;
  }

  @media (max-width: 1024px) {
    min-width: 100%;
    height: 42px;
    padding: 10px 16px;
    font-size: 15px;
    border-radius: 12px;
    justify-content: flex-start;

    ${props => props.$active ? `
    font-weight: 700;
    color: var(--color-primary-500);
    background-color:rgba(9, 0, 0, 0.1);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  ` : `
    font-weight: 400;
    color: var(--color-primary-500);
    background-color: transparent;

    &:hover {
      background-color: rgba(9, 0, 0, 0.1);
    }
  `}
    // color: #043F35 !important;
    // font-weight: 700;
    // background-color: transparent;
    // box-shadow: none;
  }
  
  @media (max-width: 768px) {
    height: 40px;
    padding: 10px 14px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    height: 36px;
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 10px;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const IconImg = styled.img`
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 2;
  transition: filter 0.2s;
  filter: brightness(0) invert(1);

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const IconButton = styled.button`
  background: none;
  border: 1px solid #656565;
  padding: 8px;
  cursor: pointer;
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, border-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: #858585;
  }

  &:active,
  &.selected {
    background-color: white;
    border-color: white;
    
    ${IconImg} {
      filter: brightness(0) saturate(100%);
    }
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    padding: 6px;
    
    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      z-index: 1;
    }
  }
`;

// const IconImg = styled.img`
//   width: 24px;
//   height: 24px;
//   position: relative;
//   z-index: 2;

//   @media (max-width: 768px) {
//     width: 20px;
//     height: 20px;
//   }
// `;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-width: 2px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 1280px) {
    width: 55px;
    height: 55px;
  }

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const AvatarCircle = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid white;
  border-radius: 50%;
  color: var(--color-primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;

  &:hover {
    background-color: var(--color-primary-100);
  }
  
  @media (max-width: 1280px) {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const PageContent = styled.main`
  flex: 1;
  max-width: 1728px;
  width: calc(100% - 48px);
  margin: 0 auto;
  padding: 24px 0;

  /* 1440px - Large desktop */
  @media (max-width: 1440px) {
    width: calc(100% - 44px);
    padding: 22px 0;
  }

  /* 1280px - Medium desktop */
  @media (max-width: 1280px) {
    width: calc(100% - 40px);
    padding: 20px 0;
  }

  /* 1024px - Small desktop/tablet landscape */
  @media (max-width: 1024px) {
    width: calc(100% - 36px);
    padding: 18px 0;
  }

  /* 768px - Tablet portrait */
  @media (max-width: 768px) {
    width: calc(100% - 32px);
    padding: 16px 0;
  }

  /* 480px - Mobile */
  @media (max-width: 480px) {
    width: calc(100% - 24px);
    padding: 12px 0;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ButtonContainer = styled.div`
  width: 232px;
  flex-shrink: 0;
  display: flex;
  align-self: flex-end;
  justify-content: center;
  
  @media (max-width: 1440px) {
    width: 180px;
  }
  @media (max-width: 1280px) {
    width: 170px;
  }
  @media (max-width: 1024px) {
    width: 160px;
  }
  @media (max-width: 768px) {
    width: 140px;
    align-self: flex-end;
  }
`;


const NewButton = styled.button`
  width: 100%; 
  height: 56px;
  border-radius: 16px;
  gap: 16px;
  background-color: #AE8119;
  color: #FFFFFF;
  padding: 8px 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  align-self: flex-end;
  transition: transform 300ms ease-out;

  &:hover {
    background-color: rgb(194, 155, 0);
    transform: scale(1.02);
  }

  span {
    font-size: 20px;
  }

  @media (max-width: 1440px) {
    height: 52px;
    font-size: 15px;
    span { font-size: 18px; }
  }

  @media (max-width: 1280px) {
    height: 48px;
    font-size: 14px;
    span { font-size: 17px; }
  }

  @media (max-width: 1024px) {
    height: 44px;
    font-size: 14px;
    span { font-size: 16px; }
  }

  @media (max-width: 768px) {
    height: 40px;
    font-size: 13px;
    border-radius: 12px;
    span { font-size: 15px; }
  }

  @media (max-width: 480px) {
    height: 36px;
    font-size: 12px;
    border-radius: 10px;
    span { font-size: 14px; }
  }
`;