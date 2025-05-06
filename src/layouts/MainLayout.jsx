import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import WeProcessLogoIcon from '../assets/images/dashboard/weprocess-logo-icon.svg';
import SearchIcon from '../assets/images/dashboard/search-icon.svg';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import MessageIcon from '../assets/images/dashboard/message-icon.svg';
import { useNavigation } from '../hooks/useNavigation';
import { PageHeader } from '../components/shared/PageHeader';
import { useAuth } from '../contexts/AuthContext';

export const MainLayout = ({ 
  children,
  title,
  showDashboardPageHeader = false,
  showInstructionsPageHeader = false,
  showInvoicePageHeader = false,
  showMessagesPageHeader = false,
  filterButtons,
  handleStatusFilterChange,
  onToggleChat,
  totalUnreadCount = 0,
  messagesLayout = false
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(''); 
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  const {
    navigateToDashboard,
    navigateToInstructions,
    navigateToInvoices,
    navigateToMessages
  } = useNavigation();

  const { user } = useAuth();

  const handleNavigation = (path, linkName) => {
    setActiveLink(linkName);
    path();
    setMobileMenuOpen(false);
  };

  const handleToggleChat = () => {
    if (onToggleChat) {
      onToggleChat();
    } else if (location.pathname !== '/messages') {
      navigateToMessages();
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      setActiveLink('Dashboard');
    } else if (path.includes('/instructions')) {
      setActiveLink('Instructions');
    } else if (path.includes('/invoices')) {
      setActiveLink('Invoices');
    } else if (path.includes('/messages')) {
      setActiveLink('Messages');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          !navRef.current.contains(event.target) && 
          !toggleRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Determine if we should show headers based on the current path
  const shouldShowHeader = showDashboardPageHeader || showInstructionsPageHeader || showInvoicePageHeader || showMessagesPageHeader;

  return (
    <AppContainer>
      <AppHeader $messagesLayout={messagesLayout}>
        <MainHeader>
          <LogoContainer>
            <MobileMenuToggle ref={toggleRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </MobileMenuToggle>
            <Logo>
              <LogoCircle>
                <LogoIcon src={WeProcessLogoIcon} alt="Logo" />
              </LogoCircle>
              <LogoName>WeProcess</LogoName>
            </Logo>
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
            {/* <NavLink 
              $active={activeLink === 'Messages'} 
              onClick={() => handleNavigation(navigateToMessages, 'Messages')}
            >
              Messages
            </NavLink> */}
          </Navigation>
          <UserActions>
            <IconButton>
              <IconImg src={SearchIcon} alt="Search" />
            </IconButton>
            <IconButton>
              <IconImg src={NotificationIcon} alt="Notifications" />
            </IconButton>
            <IconButton onClick={handleToggleChat}>
              <IconImg src={MessageIcon} alt="Messages" />
              {totalUnreadCount > 0 && <UnreadBadge>{totalUnreadCount}</UnreadBadge>}
            </IconButton>
            <UserAvatar src="https://i.sstatic.net/l60Hf.png" alt="User" />
          </UserActions>
        </MainHeader>
        
        {shouldShowHeader && (
          <>
            {showDashboardPageHeader && (
              <DashboardHeader>
                <Title>Good Morning, {user?.name || user?.first_name || 'User'}!</Title>
                <NewButton>
                  <span>+</span> New Instruction
                </NewButton>
              </DashboardHeader>
            )}

            {showInvoicePageHeader && (
              <DashboardHeader style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <PageHeader
                  title={title} 
                  filterButtons={filterButtons} 
                  onFilterChange={handleStatusFilterChange} 
                />
              </DashboardHeader>
            )}

            {showInstructionsPageHeader && (
              <DashboardHeader>
                <PageHeader
                  title={title}
                  filterButtons={filterButtons} 
                  onFilterChange={handleStatusFilterChange} 
                />
                <NewButton>
                  <span>+</span> New Instruction
                </NewButton>
              </DashboardHeader>
            )}

            {showMessagesPageHeader && (
              <DashboardHeader>
                <PageHeader
                  title={title}
                  filterButtons={filterButtons} 
                  onFilterChange={handleStatusFilterChange} 
                />
              </DashboardHeader>
            )}
          </>
        )}
      </AppHeader>
      
      <PageContent $messagesLayout={messagesLayout}>
        {children}
      </PageContent>
    </AppContainer>
  );
};

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
  width: calc(100% - 48px);
  margin: 24px auto 0;
  border-radius: 20px;
  overflow: hidden;
  min-height: ${props => props.$messagesLayout ? '180px' : '314px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${props => props.$messagesLayout ? '20px 40px' : '40px'};
  
  @media (max-width: 1000px) {
    width: calc(100% - 32px);
    padding: ${props => props.$messagesLayout ? '20px 30px' : '30px'};
  }
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 1000px) {
    flex-wrap: wrap;
    height: auto;
    gap: 16px;
  }
`;

const DashboardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary-500);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  
  // @media (max-width: 768px) {
  // }
`;

const LogoCircle = styled.div`
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const LogoName = styled.span`
  @media (max-width: 1000px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1000px) {
    gap: 8px;
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
  
  @media (max-width: 1000px) {
    display: block;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 8px;
  
  @media (max-width: 1000px) {
    position: fixed;
    top: 120px;
    left: 55px; 
    flex-direction: column;
    width: auto;
    min-width: 200px;
    background-color: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    display: ${props => props.$mobileMenuOpen ? 'flex' : 'none'};
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;


const NavLink = styled.a`
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  min-width: 120px;
  width: auto;
  height: 52px;
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  
  ${props => props.$active ? `
    font-weight: 700;
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 2px 8px 0px #00000026;
  ` : `
    font-weight: 400;
    color: #E5E5E5;
    background-color: transparent;
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 1000px) {
    min-width: 100px;
    padding: 12px 16px;
    height: 44px;
  }
  
  @media (max-width: 768px) {
    height: 35px;
    padding: 12px 16px;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;


const IconButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconImg = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-width: 2px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
`;

const PageContent = styled.main`
  flex: 1;
  max-width: 1728px;
  width: calc(100% - 48px);
  margin: 0 auto;
  padding: ${props => props.$messagesLayout ? '10px 0 24px' : '24px 0'};
  
  @media (max-width: 768px) {
    width: calc(100% - 32px);
    padding: ${props => props.$messagesLayout ? '10px 0 16px' : '16px 0'};
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

const NewButton = styled.button`
  background-color: #AE8119;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
  
  &:hover {
    background-color:rgb(230, 184, 0);
    transform: translateY(-1px);
  }
  
  span {
    font-size: 20px;
  }
  
  @media (max-width: 1000px) {
    justify-content: center;
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #FF4D4F;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;