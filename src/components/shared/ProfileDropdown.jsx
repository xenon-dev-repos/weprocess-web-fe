import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import ProfileIcon from '../../assets/images/dashboard/profile-icon.svg';
import PasswordIcon from '../../assets/images/dashboard/lock-icon.svg';
import LogoutIcon from '../../assets/images/dashboard/logout-icon.svg';

export const ProfileDropdown = ({ onClose, avatarRef }) => {
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && 
            !dropdownRef.current.contains(event.target) &&
            avatarRef.current &&
            !avatarRef.current.contains(event.target)) {
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose, avatarRef]);
    
  const handleItemClick = (action) => {
    switch(action) {
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'password':
        console.log('Change Password clicked');
        break;
      case 'logout':
        console.log('Logout clicked');
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <DropdownContainer ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <DropdownItem onClick={() => handleItemClick('profile')}>
        <IconContainer>
          <Icon src={ProfileIcon} alt="Profile" />
        </IconContainer>
        <TextContainer>
          <Title>Profile</Title>
          <Description>View your profile</Description>
        </TextContainer>
      </DropdownItem>
      
      <Divider />
      
      <DropdownItem onClick={() => handleItemClick('password')}>
        <IconContainer>
          <Icon src={PasswordIcon} alt="Change Password" />
        </IconContainer>
        <TextContainer>
          <Title>Change Password</Title>
          <Description>Update your password</Description>
        </TextContainer>
      </DropdownItem>
      
      <Divider />
      
      <DropdownItem onClick={() => handleItemClick('logout')}>
        <IconContainer>
          <Icon src={LogoutIcon} alt="Logout" />
        </IconContainer>
        <TextContainer>
          <Title>Logout</Title>
          <Description>Sign out of your account</Description>
        </TextContainer>
      </DropdownItem>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 130px;
  width: 374px;
  min-height: 226px;
  border-radius: 20px;
  background-color: var(--color-neutral-100);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  /* Large desktop */
  @media (max-width: 1440px) {
    width: 350px;
    right: 30px;
  }

  /* Medium desktop */
  @media (max-width: 1280px) {
    width: 330px;
    right: 25px;
    top: 110px;
  }

  /* Small desktop */
  @media (max-width: 1024px) {
    width: 310px;
    right: 20px;
    top: 105px;
    padding: 20px 12px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    width: 280px;
    right: 15px;
    top: 95px;
    padding: 16px 12px;
  }

  /* Large mobile */
  @media (max-width: 480px) {
    width: 260px;
    right: 10px;
    top: 85px;
  }

  /* Small mobile */
  @media (max-width: 375px) {
    width: 240px;
    right: 8px;
    padding: 14px 10px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    gap: 12px;
    padding: 10px 6px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 100px;
//   border: 1px solid var(--color-neutral-200);
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
  }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: var(--color-text-dark);

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Description = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: var(--color-text-lite);

  @media (max-width: 768px) {
    font-size: 11px;
    line-height: 18px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-neutral-700);
  margin: 4px 0;
`;