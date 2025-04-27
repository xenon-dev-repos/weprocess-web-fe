import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/signup');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  if (!user) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Container>
      <Header>
        <Logo src="/logo.svg" alt="WeProcess Logo" />
        <UserMenu>
          <UserInfo>
            <strong>{user.full_name}</strong>
            <span>{user.email}</span>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserMenu>
      </Header>
      
      <Content>
        <WelcomeCard>
          <h1>Welcome to WeProcess!</h1>
          <p>Your account has been successfully created.</p>
          <p>This is a placeholder dashboard. The actual dashboard will be implemented in future phases.</p>
        </WelcomeCard>
        
        <UserInfoCard>
          <h2>Your Information</h2>
          <InfoItem>
            <label>Name:</label>
            <span>{user.full_name}</span>
          </InfoItem>
          <InfoItem>
            <label>Email:</label>
            <span>{user.email}</span>
          </InfoItem>
          <InfoItem>
            <label>Phone:</label>
            <span>{user.phone_number}</span>
          </InfoItem>
          {user.firm_name && (
            <InfoItem>
              <label>Firm:</label>
              <span>{user.firm_name}</span>
            </InfoItem>
          )}
          <InfoItem>
            <label>Address:</label>
            <span>{user.address}</span>
          </InfoItem>
        </UserInfoCard>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 40px;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  
  strong {
    font-size: 1rem;
  }
  
  span {
    font-size: 0.8rem;
    color: #666;
  }
`;

const LogoutButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #122619;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const WelcomeCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const UserInfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  label {
    font-weight: 600;
    width: 100px;
  }
  
  span {
    flex: 1;
  }
`;

export default DashboardPage; 