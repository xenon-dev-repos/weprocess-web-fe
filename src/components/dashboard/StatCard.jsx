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
          <StatSubtext bg={subtextBg} color={subtextColor}>
            {subtext}
          </StatSubtext>
        )}
      </StatValue>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: white;
//   width: 369.333px;
  height: 200px;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; 
`;

const StatTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #111827;
  margin: 0;
`;

const StatSubtitle = styled.p`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #6B7280;
  margin: 0;
`;

const StatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const StatNumber = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #111827;
`;

const StatSubtext = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: ${props => props.color};
  background-color: ${props => props.bg};
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
`;