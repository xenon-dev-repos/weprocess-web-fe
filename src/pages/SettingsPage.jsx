import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SubLayout } from '../layouts/SubLayout';
import { 
  FormGroup, 
  Input, 
  Label,
  PhoneInputContainer, 
  CountryCode, 
  PasswordToggle,
  PasswordInputContainer,
  FlagIcon  
} from '../components/shared/FormElements';

import { Images } from '../assets/images/index.js'
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../services/ToastService';
// import { useNavigation } from '../hooks/useNavigation.js';
import { useApi } from '../hooks/useApi.js';
import { ROUTES } from '../constants/routes.js';
import { MainLayout } from '../layouts/MainLayout.jsx';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, formatPhoneNumber, setUser } = useAuth();
  // const { navigateToSignIn } = useNavigation();
  const { showError, showSuccess } = useToast();
  const api = useApi();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(urlTab || 'profile');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    billing_address: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: '',
    new_password: '',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  // const [headerData, setHeaderData] = useState({
  //   title: 'Profile',
  //   icon: Images.dashboard.profileIcon
  // });
  const [headerData, setHeaderData] = useState(() => {
    switch(urlTab) {
      case 'password':
        return {
          title: 'Change Password', 
          icon: Images.dashboard.lockIcon
        };
      case 'logout':
        return {
          title: 'Logout',
          icon: Images.dashboard.logoutIcon
        };
      default:
        return {
          title: 'Profile',
          icon: Images.dashboard.profileIcon
        };
    }
  });
  const phoneInputRef = useRef(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (cursorPosition !== null && phoneInputRef.current) {
      phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null);
    }
  }, [phoneNumber, cursorPosition]);

  const handleChange = (e) => {
    const { name, value, selectionStart } = e.target;
    if (activeTab === 'password') {
      setPasswordFormData(prev => ({
        ...prev,
        [name]: value
      }));

      return;
    }

    if (name === 'phone_number') {
      const formattedValue = formatPhoneNumber(value, phoneNumber);
      const cursorOffset = formattedValue.length - value.length;
      const newCursorPosition = selectionStart + cursorOffset;
      
      setPhoneNumber(formattedValue);
      setCursorPosition(newCursorPosition);

      setFormData(prev => ({
        ...prev,
        phone_number: formattedValue.replace(/\s/g, '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateEmail = (email) => {
    // Basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    try {
      const response = await api.updateUserProfile(formData);
      if (response.success) {
        // Update local storage
        const existingUserData = JSON.parse(localStorage.getItem('userData')) || {};
        const newUserData = {
          ...existingUserData,
          ...response.client // Use the client data from the API response
        };
        localStorage.setItem('userData', JSON.stringify(newUserData));
        
        // Update auth context
        setUser(newUserData);
        
        // Show success message
        // showSuccess('Profile updated successfully');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      showError(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordFormData.new_password === passwordFormData.current_password) {
      setPasswordError('New password must be different from the current password.');
      return;
    }
    if (passwordFormData.new_password !== confirmPassword) {
      showError("New passwords don't match");
      return;
    }
    try {
      await api.updateUserPassword({
        current_password: passwordFormData.current_password,
        new_password: passwordFormData.new_password
      });
    } catch (err) {
      console.error('password update error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'profile' && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number?.replace(/\D/g, '') || '',
        billing_address: user.billing_address || '',
      });
  
      // Format phone number visually for display
      const digitsOnly = user.phone_number?.replace(/\D/g, '') || '';
      let formattedPhone = digitsOnly;
  
      if (digitsOnly.startsWith('7')) {
        if (digitsOnly.length > 5) {
          formattedPhone = `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5, 8)} ${digitsOnly.slice(8, 11)}`;
        }
      } else {
        if (digitsOnly.length > 3) {
          formattedPhone = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)}`;
        }
      }
  
      setPhoneNumber(formattedPhone);
    }
  }, [user, activeTab]);  

  useEffect(() => {
    navigate(`${ROUTES.SETTINGS}?tab=${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      handleItemClick(urlTab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab]);

  const handleItemClick = (action) => {
    if (action === 'logout') {
      logout();
      return;
    }
    switch(action) {
      case 'profile':
        setHeaderData({
          title: 'Profile',
          icon: Images.dashboard.profileIcon
        });
        break;
      case 'password':
        setHeaderData({
          title: 'Change Password', 
          icon: Images.dashboard.lockIcon
        });
        break;
      default:
        setHeaderData({
          title: 'Settings',
          icon: Images.dashboard.settingsIcon
        });
    }
    setActiveTab(action);
  };

  const renderRightSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Full name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="WeProcess"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  $height="56px"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email address</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  $height="56px"
                  required
                  disabled
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    cursor: 'not-allowed',
                    opacity: 0.8
                  }}
                />
                {emailError && (
                  <span style={{ color: 'red', fontSize: '13px' }}>{emailError}</span>
                )}
              </FormGroup>
                  
              <FormGroup>
                <Label>Contact number</Label>
                <PhoneInputContainer>
                  <CountryCode $height={'56px'}>
                    <FlagIcon src={Images.auth.ukFlag} alt='Flag'/>
                    <span>+44</span>
                  </CountryCode>
                  <Input
                    type="tel"
                    name="phone_number"
                    placeholder="71 7946 0958"
                    value={phoneNumber}
                    onChange={handleChange}
                    required
                    ref={phoneInputRef}
                    $height="56px"
                  />
                </PhoneInputContainer>
              </FormGroup>
              
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="billing_address"
                  placeholder="ABC street 4, NY"
                  value={formData.billing_address}
                  onChange={handleChange}
                  required
                  $height="56px"
                />
              </FormGroup>
              
              <ButtonGroup>
                <FormButton type="submit" disabled={api.loading}>
                {api.loading ? 'Updating' : 'Update'}
                </FormButton>
              </ButtonGroup>
            </form>
          </FormContainer>
        );
      case 'password':
        return (
          <FormContainer>
            <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
                <Label>Current Password</Label>
                <PasswordInputContainer>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current_password"
                    placeholder="********"
                    value={passwordFormData.current_password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    $height="56px"
                  />
                  <PasswordToggle onClick={toggleCurrentPasswordVisibility} type="button">
                    {showCurrentPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </PasswordToggle>
                </PasswordInputContainer>
              </FormGroup>

              <FormGroup>
                <Label>New Password</Label>
                <PasswordInputContainer>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    placeholder="********"
                    value={passwordFormData.new_password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    $height="56px"
                  />
                  <PasswordToggle onClick={toggleNewPasswordVisibility} type="button">
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </PasswordToggle>
                </PasswordInputContainer>
                {passwordError && (
                  <span style={{ color: 'red', fontSize: '13px' }}>{passwordError}</span>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label>Confirm Password</Label>
                <PasswordInputContainer>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                    $height="56px"
                  />
                  <PasswordToggle onClick={toggleConfirmPasswordVisibility} type="button">
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </PasswordToggle>
                </PasswordInputContainer>
              </FormGroup>

              <ButtonGroup>
                <FormButton type="submit" disabled={api.loading}>
                {api.loading ? 'Updating' : 'Update'}
                </FormButton>
                {/* <CancelButton type="button" onClick={() => {
                  setPasswordFormData({
                    current_password: '',
                    new_password: ''
                  });
                  setConfirmPassword('');
                }}>
                  Cancel
                </CancelButton> */}
              </ButtonGroup>
            </form>
          </FormContainer>
        );
      case 'logout':
        return null;
      default:
        return null;
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // const handleBackToLogin = () => {
  //   navigateTo('/signin');
  // };


  return (
    <MainLayout>
      <SubLayout
        pageTitle={'Settings'}
        title={headerData.title}
        icon={headerData.icon}
      >
        {/* Left Section Content */}
        <>
          <DropdownItem           
            onClick={() => handleItemClick('profile')}
            $isActive={activeTab === 'profile'}
          >
            <DropdownIconContainer $isActive={activeTab === 'profile'}>
              <DropdownIcon $isActive={activeTab === 'profile'} src={Images.dashboard.profileIcon} alt="Profile" />
            </DropdownIconContainer>
            <DropdownTextContainer>
              <DropdownTitle>Profile</DropdownTitle>
              <DropdownDescription>View your profile</DropdownDescription>
            </DropdownTextContainer>
          </DropdownItem>

          <DropdownItem 
            onClick={() => handleItemClick('password')}
            $isActive={activeTab === 'password'}
          >
            <DropdownIconContainer $isActive={activeTab === 'password'}>
              <DropdownIcon $isActive={activeTab === 'password'} src={Images.dashboard.lockIcon} alt="Change Password" />
            </DropdownIconContainer>
            <DropdownTextContainer>
              <DropdownTitle>Change Password</DropdownTitle>
              <DropdownDescription>Update your password</DropdownDescription>
            </DropdownTextContainer>
          </DropdownItem>
        
          <DropdownItem 
            onClick={() => handleItemClick('logout')}
            $isActive={activeTab === 'logout'}
          >
            <DropdownIconContainer $isActive={activeTab === 'logout'}>
              <DropdownIcon $isActive={activeTab === 'logout'} src={Images.dashboard.logoutIcon} alt="Logout" />
            </DropdownIconContainer>
            <DropdownTextContainer>
              <DropdownTitle>Logout</DropdownTitle>
              <DropdownDescription>Sign out of your account</DropdownDescription>
            </DropdownTextContainer>
          </DropdownItem>
        </>

        {/* Right Section Content */}
        <>
        {renderRightSection()}
        </>
      </SubLayout>
    </MainLayout>
  );
};

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  margin-bottom: 10px;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.$isActive ? '#F0F6E3' : 'transparent'};

  &:hover {
    background-color: #F0F6E3;
  }

  @media (max-width: 1024px) {
    gap: 6px;
    padding: 10px 6px;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    border-radius: 8px;
  }
`;

const DropdownIconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  background-color: ${props => props.$isActive ? 'var(--color-primary-500)' : 'rgba(0, 0, 0, 0.05)'};
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
`;

const DropdownIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: ${props => props.$isActive ? 'brightness(0) invert(1)' : 'none'};

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const DropdownTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DropdownTitle = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  color: #121F24;

  @media (max-width: 1024px) {
    font-size: 12px;
  }
`;

const DropdownDescription = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #616161;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const FormContainer = styled.div`
  max-width: 579px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 24px;
`;

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
`;

export const FormButton = styled.button`
  width: 105px;
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
  }
`;

export default SettingsPage;