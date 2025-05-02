import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import WeProcessLogoIcon from '../assets/images/dashboard/weprocess-logo-icon.svg';
import SearchIcon from '../assets/images/dashboard/search-icon.svg';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import MessageIcon from '../assets/images/dashboard/message-icon.svg';

export const MainLayout = ({ children, showDashboardHeader = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

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

  return (
    <AppContainer>
      <AppHeader>
        <MainHeader>
          <LogoContainer>
            <MobileMenuToggle ref={toggleRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </MobileMenuToggle>
            <Logo>
              <LogoCircle>
                {/* <LogoText>WP</LogoText> */}
                <LogoIcon src={WeProcessLogoIcon} alt="Logo" />
              </LogoCircle>
              <LogoName>WeProcess</LogoName>
            </Logo>
          </LogoContainer>
          <Navigation ref={navRef} mobileMenuOpen={mobileMenuOpen}>
            <NavLink href="#" active={true}>Dashboard</NavLink>
            <NavLink href="#">Instructions</NavLink>
            <NavLink href="#">Reports</NavLink>
          </Navigation>
          <UserActions>
          <IconButton>
              <IconImg src={SearchIcon} alt="Search" />
            </IconButton>
            <IconButton>
              <IconImg src={NotificationIcon} alt="Notifications" />
            </IconButton>
            <IconButton>
              <IconImg src={MessageIcon} alt="Messages" />
            </IconButton>
            <UserAvatar src="https://via.placeholder.com/40" alt="User" />
          </UserActions>
        </MainHeader>
        
        {showDashboardHeader && (
          <DashboardHeader>
            <Title>Good Morning, Andrew!</Title>
            <NewButton>
              <span>+</span> New Instruction
            </NewButton>
          </DashboardHeader>
        )}
      </AppHeader>
      
      <PageContent>
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
  background-color: var(--primary-color);
  color: white;
  max-width: 1728px;
  width: calc(100% - 48px);
  margin: 24px auto 0;
  border-radius: 20px;
  overflow: hidden;
  
  @media (max-width: 1000px) {
    width: calc(100% - 32px);
  }
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 40px 40px 40px;
  height: 80px;
  
  @media (max-width: 1000px) {
    padding: 40px 30px 30px 30px;
    flex-wrap: wrap;
    height: auto;
    gap: 16px;
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


const LogoText = styled.span`
  color: var(--primary-color);
  font-weight: bold;
  font-size: 30px;
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
    display: ${props => props.mobileMenuOpen ? 'flex' : 'none'};
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
  
  ${props => props.active ? `
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
  width: 52px;
  height: 52px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  
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
  padding: 24px 0;
  
  @media (max-width: 768px) {
    width: calc(100% - 32px);
    padding: 16px 0;
  }
`;

const DashboardHeader = styled.div`
width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 40px 40px 40px;
  background-color: var(--primary-color);
  
  @media (max-width: 1000px) {
    padding: 40px 30px 30px 30px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
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
  background-color: #eab308;
  color: var(--primary-color);
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
  
  &:hover {
    background-color: #facc15;
    transform: translateY(-1px);
  }
  
  span {
    font-size: 20px;
  }
  
  @media (max-width: 1000px) {
    justify-content: center;
    align-self: flex-end;
  }
`;