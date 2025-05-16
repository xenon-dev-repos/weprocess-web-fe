import styled from 'styled-components';
import { Images } from '../../assets/images';

export const ServiceCard = ({ 
  title, 
  image, 
  description, 
  price, 
  isSelected, 
  onSelect 
}) => {
  return (
    <ServiceCardContainer 
      $isSelected={isSelected}
      onClick={onSelect}
    >
      <CardTitle>{title}</CardTitle>

      <CardImage src={image} alt={title} />
      
      <DescriptionContainer>
        {description.map((text, index) => (
          <DescriptionText key={index}>{text}</DescriptionText>
        ))}
      </DescriptionContainer>
      
      <Price>{price}</Price>
      
      <RadioContainer>
        <RadioIcon 
          src={isSelected ? Images.instructions.selectRadioIcon : Images.instructions.unSelectRadioIcon} 
          alt={isSelected ? "Selected" : "Unselected"} 
        />
      </RadioContainer>
    </ServiceCardContainer>
  );
};

const ServiceCardContainer = styled.div`
  width: 100%;
  max-width: 289.25px;
  height: 380px;
  border-radius: 20px;
  padding: 24px;
  border: 2px solid ${props => props.$isSelected ? '#043F35' : '#E5E7EB'};
  background-color: ${props => props.$isSelected ? '#F0F6E3' : '#F5F5F5'};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  @media (max-width: 1440px) {
    padding: 22px;
    gap: 28px;
    max-width: 275px;
  }

  @media (max-width: 1280px) {
    padding: 20px;
    gap: 24px;
    max-width: 260px;
    height: auto;
  }

  @media (max-width: 1024px) {
    padding: 18px;
    gap: 20px;
    max-width: 240px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 18px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    gap: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (max-width: 1440px) {
    gap: 14px;
  }

  @media (max-width: 1280px) {
    gap: 12px;
  }

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const CardTitle = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #043F35;
  margin: 0;

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
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const CardImage = styled.img`
  width: 145px;
  height: 64px;
  object-fit: contain;

  @media (max-width: 1440px) {
    width: 135px;
    height: 60px;
  }

  @media (max-width: 1280px) {
    width: 125px;
    height: 56px;
  }

  @media (max-width: 1024px) {
    width: 115px;
    height: 52px;
  }

  @media (max-width: 768px) {
    width: 125px;
    height: 56px;
  }

  @media (max-width: 480px) {
    width: 115px;
    height: 50px;
  }
`;

const DescriptionContainer = styled.div`
  width: 100%;
  max-width: 254px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: 1440px) {
    gap: 7px;
    max-width: 240px;
  }

  @media (max-width: 1280px) {
    gap: 6px;
    max-width: 225px;
  }

  @media (max-width: 1024px) {
    gap: 5px;
    max-width: 210px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const DescriptionText = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  margin: 0;
  text-align: center;
  text-wrap: nowrap;

  @media (max-width: 1440px) {
    font-size: 15px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #043F35;
  text-align: center;

  @media (max-width: 1440px) {
    font-size: 30px;
  }

  @media (max-width: 1280px) {
    font-size: 28px;
  }

  @media (max-width: 1024px) {
    font-size: 26px;
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    gap: 6px;
  }
`;

const RadioIcon = styled.img`
  width: 16px;
  height: 24px;

  @media (max-width: 1440px) {
    width: 15px;
    height: 22px;
  }

  @media (max-width: 1280px) {
    width: 14px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 13px;
    height: 18px;
  }
`;
