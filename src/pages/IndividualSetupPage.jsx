import { useState, useEffect, useRef } from 'react';
import FlagImg from '../assets/images/auth/uk-flag.svg'
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { CountryCode, FlagIcon, FormGroup, Input, Label, PasswordInputContainer, PasswordToggle, PhoneInputContainer, SubmitButton } from '../components/shared/FormElements';
import { useNavigate } from 'react-router-dom';

const IndividualSetupPage = () => {
  const { registrationData, completeRegistration, loading, formatPhoneNumber } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    password: '',
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (cursorPosition !== null && phoneInputRef.current) {
      phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null);
    }
  }, [phoneNumber, cursorPosition]);
    
  useEffect(() => {
    if (registrationData?.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: registrationData.email
      }));
    }
  }, [registrationData, formData.email]);
  
  const handleChange = (e) => {
    const { name, value, selectionStart } = e.target;
    
    if (name === 'phone_number') {
      setCursorPosition(selectionStart);
  
      const formattedValue = formatPhoneNumber(value, phoneNumber);
      setPhoneNumber(formattedValue);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataForSubmit = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'phone_number' && !formData[key].startsWith('+')) {
        const digitsOnly = formData[key].replace(/\D/g, '');
        formDataForSubmit.append(key, `+44${digitsOnly}`);
      } else {
        formDataForSubmit.append(key, formData[key]);
      }
    });
    
    formDataForSubmit.append('type', 'individual');
    
    const success = await completeRegistration(formDataForSubmit);
    if (success) {
      // Force a full page navigation to dashboard to avoid SPA routing issues
      // window.location.href = '/dashboard';
      navigate('/dashboard')
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Welcome to WeProcess"
      subtitle="let's get your account set up."
      signInText="Already have an account?"
      signInLink="/signin"
      signInLinkText="Sign In"
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle onClick={togglePasswordVisibility} type="button">
              {showPassword ? (
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
          <Label>Full name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Andrew Garfield"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Phone number</Label>
          <PhoneInputContainer>
            <CountryCode>
            <FlagIcon src={FlagImg} alt='Flag'/>
            <span>+44</span>
            </CountryCode>
            <Input
              type="tel"
              name="phone_number"
              placeholder="7946 095862"
              value={phoneNumber}
              onChange={handleChange}
              required
              ref={phoneInputRef}
            />
          </PhoneInputContainer>
        </FormGroup>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Create account'}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default IndividualSetupPage; 