import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FormGroup, Input, Label, SubmitButton } from '../components/shared/FormElements';
import { AuthLayout } from '../layouts/AuthLayout';
import { useNavigation } from '../hooks/useNavigation';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading } = useAuth();
  const { navigateTo } = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await requestPasswordReset(email);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigateTo('/signin');
  };

  return (
    <AuthLayout
      title={isSubmitted ? "Email Sent" : "Forgot Password"}
      subtitle={isSubmitted ? 
        "We've sent password reset instructions to your email" : 
        "Enter your email to reset your password"}
      signInText="Remember your password?"
      signInLink="/signin"
      signInLinkText="Sign In"
    >
      {!isSubmitted ? (
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
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </SubmitButton>
          
          <BackLink onClick={handleBackToLogin}>
            Back to Sign In
          </BackLink>
        </form>
      ) : (
        <SuccessMessage>
          <SuccessIcon>✓</SuccessIcon>
          <p>We've sent password reset instructions to <strong>{email}</strong></p>
          <p>Please check your inbox and follow the link to reset your password.</p>
          <BackToLoginButton onClick={handleBackToLogin}>
            Back to Sign In
          </BackToLoginButton>
        </SuccessMessage>
      )}
    </AuthLayout>
  );
};

const BackLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  cursor: pointer;
  color: var(--color-primary-500);
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--color-primary-500);
  }
  
  p {
    margin-bottom: 1rem;
    color: #666;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--color-primary-500);
  color: white;
  font-size: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const BackToLoginButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #122619;
  }
`;

export default ForgotPasswordPage; 