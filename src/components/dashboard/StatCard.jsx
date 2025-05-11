import React from 'react';
import styled from 'styled-components';

export const StatCard = ({ 
  title, 
  subtitle, 
  value, 
  subtext, 
  subtextColor = '#374151',
  subtextBg = '#DEFFE4'
}) => {
  return (
    <CardContainer>
      <TitleWrapper>
        <StatTitle>{title}</StatTitle>
        <StatSubtitle>{subtitle}</StatSubtitle>
      </TitleWrapper>
      <StatValue>
        <StatNumber>{value}</StatNumber>
        {subtext && (
          <StatSubtext $bg={subtextBg} color={subtextColor}>
            {subtext}
          </StatSubtext>
        )}
      </StatValue>
    </CardContainer>
  );
};
const CardContainer = styled.div`
  background-color: white;
  height: 200px;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 1440px) {
    height: 180px;
    padding: 20px;
  }

  @media (max-width: 1024px) {
    height: 160px;
    padding: 18px;
    border-radius: 18px;
  }

  @media (max-width: 768px) {
    height: 150px;
    padding: 16px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    height: 140px;
    padding: 14px;
    border-radius: 14px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const StatTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #111827;
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 17px;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const StatSubtitle = styled.p`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #6B7280;
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 15px;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const StatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;

  @media (max-width: 1024px) {
    margin-top: 12px;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    gap: 6px;
  }
`;

const StatNumber = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #111827;

  @media (max-width: 1440px) {
    font-size: 42px;
  }

  @media (max-width: 1024px) {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const StatSubtext = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: ${props => props.color};
  background-color: ${props => props.$bg};
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 3px 6px;
    border-radius: 18px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 16px;
  }
`;