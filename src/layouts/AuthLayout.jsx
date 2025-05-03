import styled from 'styled-components';
import AuthImage from '../assets/images/auth/auth-image.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthLayout = ({ 
    children,
    title,
    subtitle,
    signInText,
    signInLink,
    signInLinkText
}) => {
  const { clearError } = useAuth();
  
  return (
    <AuthContainer>
      <AuthContent>
        <Sidebar>
            <Logo src="/logo.svg" alt="WeProcess Logo" />
            <ImagesGrid>
            <img src={AuthImage} alt="People Image" />
            </ImagesGrid>
        </Sidebar>
        <Content>
               <LogoMobile src="/logo.svg" alt="WeProcess Logo" />
               <SignInLink>
               {signInText} <Link onClick={clearError} to={signInLink}>{signInLinkText}</Link>
                </SignInLink>
                <ContentContainer>
                    <Title>{title}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                    <FormContainer>
                       {children}
                    </FormContainer>
                </ContentContainer>
        </Content>
      </AuthContent>
    </AuthContainer>
  );
};

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(112.42deg, #DDEEE0 9.22%, #86CE96 131.69%);
  padding: 24px;
  box-sizing: border-box;
`;

const AuthContent = styled.div`
  max-width: 1728px;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  min-height: 90vh;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }
`;


const Sidebar = styled.div`
  width: 45%;
  background-color: white;
  padding: 70px 60px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.img`
  height: 60px;
  margin-bottom: 2rem;
  z-index: 2;
  display: flex;
  align-self: flex-start;
`;


const LogoMobile = styled.img`
  display: none;
  height: 44px;
  margin-bottom: 2rem;
  z-index: 2;
  align-self: center;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ImagesGrid = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: auto;
    max-height: 556px;
    object-fit: contain;
    border-radius: 1.5rem;
  }
`;

const Content = styled.div`
  width: 55%;
  padding: 70px 60px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background-color:rgb(247, 247, 247);

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 30px;
  }
`;

const SignInLink = styled.div`
  text-align: right;
  margin-bottom: 3rem;
  
  a {
    color: var(--primary-color);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

    @media (max-width: 500px) {
    margin-bottom: 2rem;
    align-self: center;
  }
`;

const ContentContainer = styled.div`
  max-width: 552px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: calc(100% - 60px);
`;

const FormContainer = styled.div`
  max-width: 486px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
`;

const Title = styled.h1`
  font-family: Manrope;
  font-weight: 700;
  font-size: 48px;
  letter-spacing: 0%;
  color: var(--primary-color);
  margin-bottom: 1rem;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 1200px) {
    font-size: 40px
  }

  @media (max-width: 1000px) {
    font-size: 28px
  }

  @media (max-width: 768px) {
   font-size: 24px
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

