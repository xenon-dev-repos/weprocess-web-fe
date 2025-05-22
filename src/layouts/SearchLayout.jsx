import React from 'react';
import styled from 'styled-components';
import SearchIcon from '../assets/images/dashboard/search-icon-black.svg';
import { MainLayout } from './MainLayout';

const SearchLayout = ({ children, title, resultCount, allResultsTitle, searchQuery, onSearchChange }) => {
  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>{title || "Notifications"}</Title>
          {resultCount !== undefined && (
            <NotificationCount>{resultCount}</NotificationCount>
          )}
        </TitleContainer>
        
        <SearchContainer>
          <SearchIconWrapper>
            <img src={SearchIcon} alt="Search" />
          </SearchIconWrapper>
          <SearchInput 
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </SearchContainer>

        <AllNotificationsText>
          {allResultsTitle || "All Notifications"}
        </AllNotificationsText>
      </HeaderSection>

      {/* Content area where NotificationsContainer will be rendered */}
      {children}
    </Container>
  );
};


const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 24px;
  border-left-width: 1px;
  min-height: auto;

  @media (max-width: 1440px) {
    padding: 22px;
  }
  
  @media (max-width: 1280px) {
    padding: 20px;
  }
  
  @media (max-width: 1024px) {
    padding: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 16px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;

  /* Specific spacing for each child */
  & > *:not(:last-child) {
    margin-bottom: 24px;
    
    @media (max-width: 1440px) {
      margin-bottom: 22px;
    }
    
    @media (max-width: 1280px) {
      margin-bottom: 20px;
    }
    
    @media (max-width: 1024px) {
      margin-bottom: 18px;
    }
    
    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
    
    @media (max-width: 480px) {
      margin-bottom: 14px;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 1440px) {
    font-size: 26px;
  }
  
  @media (max-width: 1280px) {
    font-size: 25px;
  }
  
  @media (max-width: 1024px) {
    font-size: 24px;
  }
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const NotificationCount = styled.div`
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  
  @media (max-width: 1440px) {
    font-size: 15px;
  }
  
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  
  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 4px 10px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 3px 9px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 8px;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  position: relative;
  height: 56px;
  
  @media (max-width: 1440px) {
    height: 52px;
  }
  
  @media (max-width: 1280px) {
    height: 48px;
  }
  
  @media (max-width: 1024px) {
    height: 44px;
  }
  
  @media (max-width: 768px) {
    height: 40px;
  }
  
  @media (max-width: 480px) {
    height: 36px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 20px;
    height: 20px;
    opacity: 0.5;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 768px) {
    left: 14px;
  }
  
  @media (max-width: 480px) {
    left: 12px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 100px;
  padding: 0 20px 0 46px;
  font-size: 16px;
  border: 1px solid transparent; 
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #999;
    transition: color 0.3s ease;
  }
  
  @media (max-width: 1440px) {
    font-size: 15px;
    padding: 0 18px 0 44px;
  }
  
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  
  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 0 16px 0 42px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0 14px 0 38px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0 12px 0 34px;
  }
`;

const AllNotificationsText = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  margin-bottom: 10px;
  
  @media (max-width: 1440px) {
    font-size: 17px;
  }
  
  @media (max-width: 1280px) {
    font-size: 16px;
  }
  
  @media (max-width: 1024px) {
    font-size: 15px;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

export default SearchLayout;