import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('firm');
  const { startRegistration, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await startRegistration(email, accountType);
    if (success) {
      // Navigate to the appropriate setup page based on account type
      if (accountType === 'firm') {
        navigate('/firm-setup');
      } else {
        navigate('/individual-setup');
      }
    }
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
          <Subtitle>Register below</Subtitle>
          
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
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <NextButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Next'}
            </NextButton>
            
            <ForgotPasswordLink>
              <Link to="/forgot-password">Forgot your password?</Link>
            </ForgotPasswordLink>
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

const AccountTypeOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccountTypeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : '#ccc'};
  border-radius: 0.5rem;
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
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const NextButton = styled.button`
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

const ForgotPasswordLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default SignupPage; 