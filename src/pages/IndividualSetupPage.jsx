import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { CountryCode, ErrorMessage, FlagIcon, FormGroup, Input, Label, PasswordInputContainer, PasswordToggle, PhoneInput, PhoneInputContainer, SubmitButton } from '../components/shared/FormElements';
import { useNavigation } from '../hooks/useNavigation';

const IndividualSetupPage = () => {
  const { registrationData, completeRegistration, loading, error } = useAuth();
  const { navigateTo } = useNavigation();
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Pre-fill email if we have it from the previous step
  useEffect(() => {
    if (registrationData?.email) {
      setFormData(prev => ({
        ...prev,
        email: registrationData.email
      }));
    } else {
      // If no registration data, redirect back to the first step
      navigateTo('/signup');
    }
  }, [registrationData, navigateTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
      // Format phone number input
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format with hyphens (XXX-XXX-XXXX)
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 6) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object for backend submission
    const formDataForSubmit = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      // Add +1 country code to phone number if it doesn't have it
      if (key === 'phone_number' && !formData[key].startsWith('+')) {
        formDataForSubmit.append(key, `+1${formData[key]}`);
      } else {
        formDataForSubmit.append(key, formData[key]);
      }
    });
    
    // Add account type
    formDataForSubmit.append('type', 'individual');
    
    console.log('About to call completeRegistration');
    const success = await completeRegistration(formDataForSubmit);
    console.log('Registration success:', success);
    
    if (success) {
      // Force a full page navigation to dashboard to avoid SPA routing issues
      window.location.href = '/dashboard';
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
              <FlagIcon>🇺🇸</FlagIcon>
              <span>+1</span>
            </CountryCode>
            <PhoneInput
              type="tel"
              name="phone_number"
              placeholder="875-523-5940"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </PhoneInputContainer>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Create account'}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default IndividualSetupPage; 