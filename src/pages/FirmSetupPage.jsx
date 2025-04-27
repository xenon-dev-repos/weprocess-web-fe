import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const FirmSetupPage = () => {
  const { registrationData, completeRegistration, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Firm name
    contact_person: '', // Contact person (full name)
    phone_number: '',
    billing_address: '', // Billing address
    date_of_birth: '', // Date of birth in DD/MM/YYYY format
  });
  const [showPassword, setShowPassword] = useState(false);
  const [dateError, setDateError] = useState('');

  // Pre-fill email if we have it from the previous step
  useEffect(() => {
    if (registrationData?.email) {
      setFormData(prev => ({
        ...prev,
        email: registrationData.email
      }));
    } else {
      // If no registration data, redirect back to the first step
      navigate('/signup');
    }
  }, [registrationData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
      // Format phone number input
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'date_of_birth') {
      // Format and validate date input
      const formattedValue = formatDateOfBirth(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      validateDateOfBirth(formattedValue);
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

  // Format date of birth as user types
  const formatDateOfBirth = (value) => {
    // Remove non-digits/slashes
    let cleaned = value.replace(/[^\d/]/g, '');
    
    // Add slashes automatically
    if (cleaned.length > 2 && cleaned.charAt(2) !== '/') {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 5 && cleaned.charAt(5) !== '/') {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }
    
    // Limit to 10 characters (DD/MM/YYYY)
    return cleaned.slice(0, 10);
  };
  
  // Validate date of birth
  const validateDateOfBirth = (date) => {
    setDateError('');
    
    if (!date) return;
    
    // Check format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) {
      setDateError('Please use DD/MM/YYYY format');
      return;
    }
    
    const [, day, month, year] = date.match(dateRegex);
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic date validation
    if (monthNum < 1 || monthNum > 12) {
      setDateError('Month must be between 1 and 12');
      return;
    }
    
    if (dayNum < 1 || dayNum > 31) {
      setDateError('Day must be between 1 and 31');
      return;
    }
    
    // Check days in month
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      setDateError(`Invalid day for ${month}/${year}`);
      return;
    }
    
    // Age verification (if needed)
    const today = new Date();
    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    
    if (birthDate > today) {
      setDateError('Date of birth cannot be in the future');
      return;
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setDateError('Must be at least 18 years old');
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date of birth before submission
    if (dateError) {
      return;
    }
    
    // Create FormData object for backend submission
    const formDataForSubmit = new FormData();
    
    // Add all fields from the form
    Object.keys(formData).forEach(key => {
      // Add +1 country code to phone number if it doesn't have it
      if (key === 'phone_number' && !formData[key].startsWith('+')) {
        formDataForSubmit.append(key, `+1${formData[key]}`);
      } else {
        formDataForSubmit.append(key, formData[key]);
      }
    });
    
    // Explicitly add type for firm registration
    formDataForSubmit.append('type', 'firm');
    
    const success = await completeRegistration(formDataForSubmit);
    if (success) {
      // Navigate to dashboard or welcome page
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Sidebar>
        <Logo src="/logo.svg" alt="WeProcess Logo" />
        <ImagesGrid>
          <img src="/images/user1.jpg" alt="" />
          <EmptyBox />
          <img src="/images/user2.jpg" alt="" />
          <LightGreenBackground />
          <LightPinkBackground />
          <img src="/images/user3.jpg" alt="" />
        </ImagesGrid>
      </Sidebar>
      <Content>
        <SignInLink>Already have an account? <Link to="/signin">Sign In</Link></SignInLink>
        <FormContainer>
          <Title>Welcome to WeProcess</Title>
          <Subtitle>let's get your law firm set up.</Subtitle>
          
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
              <Label>Firm name</Label>
              <Input
                type="text"
                name="name"
                placeholder="WeProcess"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Contact person</Label>
              <Input
                type="text"
                name="contact_person"
                placeholder="Andrew Garfield"
                value={formData.contact_person}
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
            
            <FormGroup>
              <Label>Billing address</Label>
              <Input
                type="text"
                name="billing_address"
                placeholder="ABC street 4, NY"
                value={formData.billing_address}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Date of Birth</Label>
              <Input
                type="text"
                name="date_of_birth"
                placeholder="DD/MM/YYYY"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                maxLength={10}
              />
              {dateError && <DateErrorMessage>{dateError}</DateErrorMessage>}
              <DateFormatHint>Please enter date in day/month/year format (e.g., 31/12/1990)</DateFormatHint>
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Create Account'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 50%;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  height: 60px;
  margin-bottom: 3rem;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 80%;
  gap: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1.5rem;
  }
`;

const EmptyBox = styled.div`
  background-color: #d9d9d9;
  border-radius: 1.5rem;
`;

const LightGreenBackground = styled.div`
  background-color: var(--secondary-color);
  border-radius: 1.5rem;
`;

const LightPinkBackground = styled.div`
  background-color: var(--light-pink);
  border-radius: 1.5rem;
`;

const Content = styled.div`
  width: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
`;

const SignInLink = styled.div`
  text-align: right;
  margin-bottom: 3rem;
  
  a {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CountryCode = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem 0 0 0.5rem;
  border-right: none;
  background-color: #f9f9f9;
  font-size: 1rem;
`;

const FlagIcon = styled.span`
  margin-right: 0.5rem;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0 0.5rem 0.5rem 0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #122619;
  }
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const DateErrorMessage = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const DateFormatHint = styled.div`
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

export default FirmSetupPage; 