import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <StarsContainer>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} $filled>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path 
              fill="#F0DB64" 
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </Star>
      ))}
      {hasHalfStar && (
        <Star key="half" $half>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stopColor="#F0DB64" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#half-star)" 
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </Star>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path 
              fill="#E5E7EB" 
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </Star>
      ))}
    </StarsContainer>
  );
};

export const ProfileSidebar = ({ userData }) => {
  return (
    <>
        <ProfileContainer>
        <AvatarContainer>
            {userData.avatar ? 
            <Avatar 
                src={userData.avatar || Images.instructions.profileAvatar} 
                alt="Profile" 
                width={72} 
                height={72} 
            /> :
            <AvatarCircle>
                {userData.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarCircle>
            }
        </AvatarContainer>
        <Name>{userData.name || 'Max Rauchenberg'}</Name>
        <StarRating rating={userData.rating || 4.5} />
        <Level>LEVEL {userData.level || 2}</Level>
        </ProfileContainer>

        <StatsContainer>
        <StatsRow>
            <StatCard>
            <StatIcon src={Images.instructions.jobsTakenIcon} alt="Jobs taken" />
            <StatTextGroup>
                <StatValue>{userData.jobsTaken || '40'}</StatValue>
                <StatLabel>Jobs taken</StatLabel>
            </StatTextGroup>
            </StatCard>
            <StatCard>
            <StatIcon src={Images.instructions.jobsCompletedIcon} alt="Jobs completed" />
            <StatTextGroup>
                <StatValue>{userData.jobsCompleted || '36'}</StatValue>
                <StatLabel>Jobs completed</StatLabel>
            </StatTextGroup>
            </StatCard>
        </StatsRow>

        <SuccessRateCard>
            <SuccessRateContent>
            <StatIcon src={Images.instructions.trendIcon} alt="Success rate" />
            <StatTextGroup>
                <StatValue>{userData.successRate || '86'}%</StatValue>
                <StatLabel>Success rate</StatLabel>
            </StatTextGroup>
            </SuccessRateContent>

            {/* <SuccessRateGraph /> */}

        </SuccessRateCard>
        </StatsContainer>
    </>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  @media (max-width: 1024px) {
    margin-bottom: 12px;
  }
`;

const Avatar = styled.img`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  object-fit: cover;

  @media (max-width: 1440px) {
    width: ${props => props.width * 0.9}px;
    height: ${props => props.height * 0.9}px;
  }

  @media (max-width: 1280px) {
    width: ${props => props.width * 0.85}px;
    height: ${props => props.height * 0.85}px;
  }

  @media (max-width: 1024px) {
    width: ${props => props.width * 0.8}px;
    height: ${props => props.height * 0.8}px;
  }

  @media (max-width: 768px) {
    width: ${props => props.width * 0.7}px;
    height: ${props => props.height * 0.7}px;
  }
`;

const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  background-color: var(--color-primary-500);

  @media (max-width: 1440px) {
    width: 68px;
    height: 68px;
    font-size: 30px;
  }

  @media (max-width: 1280px) {
    width: 65px;
    height: 65px;
    font-size: 28px;
  }

  @media (max-width: 1024px) {
    width: 60px;
    height: 60px;
    font-size: 26px;
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 24px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
`;

const Name = styled.div`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0px;
  text-align: center;
  color: #121F24;
  margin-bottom: 8px;

  @media (max-width: 1440px) {
    font-size: 22px;
  }

  @media (max-width: 1280px) {
    font-size: 20px;
  }

  @media (max-width: 1024px) {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const Star = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  
  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const Level = styled.div`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0px;
  text-align: center;
  color: #121F24;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 1024px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  width: 50%;
  height: 68px;
  border-radius: 20px;
  background: #FFFFFF;
  box-shadow: 
    2px 2px 15px 0px rgba(166, 171, 189, 0.25),
    -1px -1px 13px 0px rgba(250, 251, 255, 1);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;

  @media (max-width: 1440px) {
    height: 64px;
    padding: 0 14px;
  }

  @media (max-width: 1280px) {
    height: 60px;
    padding: 0 12px;
  }

  @media (max-width: 1024px) {
    height: 56px;
    padding: 0 10px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 52px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    height: 48px;
    padding: 0 8px;
  }
`;

const SuccessRateCard = styled(StatCard)`
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    height: 56px;
  }
`;

const SuccessRateContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    gap: 10px;
  }
`;

const StatIcon = styled.img`
  width: 33.5px;
  height: 28px;

  @media (max-width: 1440px) {
    width: 30px;
    height: 25px;
  }

  @media (max-width: 1024px) {
    width: 28px;
    height: 23px;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 22px;
  }
`;

const StatTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const StatValue = styled.div`
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.2px;
  color: #000000;

  @media (max-width: 1440px) {
    font-size: 15px;
    line-height: 18px;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 16px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 15px;
  }
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #9098A3;
  text-wrap: nowrap;

  @media (max-width: 1440px) {
    font-size: 14px;
    line-height: 18px;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    line-height: 16px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 14px;
  }
`;

const SuccessRateGraph = styled.div`
  width: 60%;
  height: 4px;
  border-radius: 2px;
  border: 2px solid;
  border-image-source: linear-gradient(270deg, #52D060 15.5%, #EDB13E 43.21%, #FF7501 85.5%);
  border-image-slice: 1;
  align-self: center;

  @media (max-width: 1024px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 40%;
    height: 3px;
  }
`;