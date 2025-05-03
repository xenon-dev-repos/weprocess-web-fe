import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { ForgotPasswordLink, FormGroup, Input, Label, SubmitButton } from '../components/shared/FormElements';
import { useNavigation } from '../hooks/useNavigation';
import { useApi } from '../hooks/useApi';
import { ROUTES } from '../constants/routes';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('firm');
  const [validating, setValidating] = useState(false);
  const { startRegistration, loading, clearError } = useAuth();
  const { navigateTo } = useNavigation();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear any previous errors
    
    try {
      setValidating(true);
      
      // Validate email with API - ApiService will handle error toast automatically
      const response = await api.validateEmail(email, accountType);
      
      // If validation is successful, continue with registration
      if (response.success) {
        const success = await startRegistration(email, accountType);
        if (success) {
          if (accountType === 'firm') {
            navigateTo(ROUTES.FIRM_SETUP);
          } else {
            navigateTo('/individual-setup');
          }
        }
      }
      // Removed duplicate toast for validation failure - ApiService already shows it
    } catch (error) {
      // Skip error toast since ApiService already shows one
      console.error('Email validation error:', error.message);
      // Don't show another error toast here
    } finally {
      setValidating(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to WeProcess"
      subtitle="Register below"
      signInText="Already have an account?"
      signInLink="/signin"
      signInLinkText="Sign In"
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>How do you want to set up your account?</Label>
          <AccountTypeOptions>
            <AccountTypeOption
              selected={accountType === 'firm'}
              onClick={() => setAccountType('firm')}
            >
              <Radio checked={accountType === 'firm'} />
              <Icon>💼</Icon>
              <OptionText>Set up my firm</OptionText>
            </AccountTypeOption>
            
            <AccountTypeOption
              selected={accountType === 'individual'}
              onClick={() => setAccountType('individual')}
            >
              <Radio checked={accountType === 'individual'} />
              <Icon>👤</Icon>
              <OptionText>Set up as an individual</OptionText>
            </AccountTypeOption>
          </AccountTypeOptions>
        </FormGroup>
        
        <TermsText>
          By continuing, you acknowledge that you agree to the{' '}
          <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link> of WeProcess.
        </TermsText>
        
        <SubmitButton type="submit" disabled={loading || validating}>
          {loading || validating ? 'Processing...' : 'Next'}
        </SubmitButton>
        
        <ForgotPasswordLink>
          <Link to="/forgot-password">Forgot your password?</Link>
        </ForgotPasswordLink>
      </form>
    </AuthLayout>
  );
};

const AccountTypeOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const AccountTypeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : '#ccc'};
  border-radius: 12px;
  cursor: pointer;
  background-color: ${props => props.selected ? 'rgba(27, 55, 40, 0.05)' : 'white'};
`;

const Radio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? 'var(--primary-color)' : '#ccc'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    display: ${props => props.checked ? 'block' : 'none'};
  }
`;

const Icon = styled.span`
  font-size: 1.25rem;
  margin-right: 0.5rem;
`;

const OptionText = styled.span`
  font-size: 1rem;
`;

const TermsText = styled.p`
  font-size: 0.9rem;
  margin: 2rem 0;
  color: #666;
  
  a {
    color: var(--primary-color);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;
    font-size: 0.85rem;
  }
`;

export default SignupPage; 