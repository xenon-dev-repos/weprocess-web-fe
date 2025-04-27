import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await requestPasswordReset(email);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate('/signin');
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
        <SignInLink>Remember your password? <Link to="/signin">Sign In</Link></SignInLink>
        <FormContainer>
          <Title>Forgot Password</Title>
          {!isSubmitted ? (
            <>
              <Subtitle>Enter your email to reset your password</Subtitle>
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
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Reset Password'}
                </SubmitButton>
                
                <BackLink onClick={handleBackToLogin}>
                  Back to Sign In
                </BackLink>
              </form>
            </>
          ) : (
            <SuccessMessage>
              <SuccessIcon>✓</SuccessIcon>
              <h2>Email Sent</h2>
              <p>We've sent password reset instructions to {email}</p>
              <p>Please check your inbox and follow the link to reset your password.</p>
              <BackToLoginButton onClick={handleBackToLogin}>
                Back to Sign In
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
`;

const SignInLink = styled.div`
  text-align: right;
  margin-bottom: 5rem;
  
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

export default ForgotPasswordPage; 