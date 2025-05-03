import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { FormGroup, Input, Label, PasswordInputContainer, PasswordToggle, SubmitButton } from '../components/shared/FormElements';
import { useNavigation } from '../hooks/useNavigation';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { resetPassword, loading } = useAuth();
  const { navigateTo } = useNavigation();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    const tokenParam = queryParams.get('token');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (tokenParam) {
      setResetToken(tokenParam);
    }
  }, [location]);

  const validatePassword = () => {
    setPasswordError('');
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    // Use both email and token for the reset password operation
    const success = await resetPassword(email, password, resetToken);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigateTo('/signin');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <AuthLayout
        title={isSubmitted ? "Password Reset Successfully" : "Reset Password"}
        subtitle={isSubmitted ? 
          "You can now log in with your new password" : 
          "Create a new password for your account"}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!email}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>New Password</Label>
              <PasswordInputContainer>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
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
              <Label>Confirm Password</Label>
              <PasswordInputContainer>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                />
              </PasswordInputContainer>
              {passwordError && <PasswordErrorMessage>{passwordError}</PasswordErrorMessage>}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Set New Password'}
            </SubmitButton>
            
            <BackLink onClick={handleBackToLogin}>
              Back to Sign In
            </BackLink>
          </form>
        ) : (
          <SuccessMessage>
            <SuccessIcon>✓</SuccessIcon>
            <p>Your password has been reset successfully.</p>
            <BackToLoginButton onClick={handleBackToLogin}>
              Go to Sign In
            </BackToLoginButton>
          </SuccessMessage>
        )}
      </AuthLayout>
    );
  };

  const PasswordErrorMessage = styled.div`
    color: red;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  `;

  const BackLink = styled.div`
    text-align: center;
    margin-top: 1rem;
    cursor: pointer;
    color: var(--primary-color);
    
    &:hover {
      text-decoration: underline;
    }
  `;

  const SuccessMessage = styled.div`
    text-align: center;
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
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
    background-color: var(--primary-color);
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
    background-color: var(--primary-color);
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

export default ResetPasswordPage; 