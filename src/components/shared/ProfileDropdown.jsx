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
  right: 35px;
  top: 133px;
  width: 374px;
  min-height: 226px;
  border-radius: 20px;
  background-color: var(--color-neutral-100);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  /* Large desktop */
  @media (max-width: 1440px) {
    width: 340px;
    right: 35px;
    top: 130px;
    padding: 20px 16px;
  }

  /* Medium desktop */
  @media (max-width: 1280px) {
    width: 320px;
    right: 30px;
    top: 125px;
    padding: 18px 14px;
  }

  /* Small desktop */
  @media (max-width: 1024px) {
    width: 300px;
    right: 25px;
    top: 110px;
    padding: 16px 12px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    width: 260px;
    right: 23px;
    top: 105px;
    padding: 14px 10px;
    min-height: 200px;
  }

  /* Large mobile */
  @media (max-width: 480px) {
    width: 220px;
    top: 100px;
    padding: 12px 8px;
    min-height: 180px;
    border-radius: 16px;
  }

  /* Small mobile */
  @media (max-width: 375px) {
    width: 200px;
    padding: 10px 6px;
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

  @media (max-width: 1024px) {
    gap: 14px;
    padding: 10px 6px;
  }

  @media (max-width: 768px) {
    gap: 12px;
    padding: 8px 6px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 6px 4px;
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

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
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

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 16px;
  }
`;

const Description = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: var(--color-text-lite);

  @media (max-width: 480px) {
    font-size: 11px;
    line-height: 14px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-neutral-700);
  // margin: 4px 0;

  // @media (max-width: 480px) {
  //   margin: 1px 0;
  // }
`;