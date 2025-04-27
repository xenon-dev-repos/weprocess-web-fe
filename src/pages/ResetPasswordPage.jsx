import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const { resetPassword, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and token from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    const tokenParam = queryParams.get('token');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (tokenParam) {
      setToken(tokenParam);
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
    
    // For a real implementation, you would send the token along with the password
    // For this demo, we'll just call resetPassword with the email and new password
    const success = await resetPassword(email, password);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate('/signin');
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
        <FormContainer>
          <Title>Reset Password</Title>
          {!isSubmitted ? (
            <>
              <Subtitle>Create a new password for your account</Subtitle>
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
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Set New Password'}
                </SubmitButton>
                
                <BackLink onClick={handleBackToLogin}>
                  Back to Sign In
                </BackLink>
              </form>
            </>
          ) : (
            <SuccessMessage>
              <SuccessIcon>✓</SuccessIcon>
              <h2>Password Reset Successfully</h2>
              <p>Your password has been reset successfully.</p>
              <p>You can now log in with your new password.</p>
              <BackToLoginButton onClick={handleBackToLogin}>
                Go to Sign In
              </BackToLoginButton>
            </SuccessMessage>
          )}
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
  justify-content: center;
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
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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

const PasswordErrorMessage = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 0.5rem;
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
  
  &:hover {
    background-color: #122619;
  }
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
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