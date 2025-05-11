// Step5PaymentMethod.js
import React from 'react';
import { InstructionsMainContainer } from '../../styles/Shared';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout';
import { useInstruction } from '../../contexts/InstructionContext';
import { Images } from '../../assets/images';
import styled from 'styled-components';

export const Step5PaymentMethod = () => {
  const { formData, handleInputChange } = useInstruction();

  return (
    <InstructionsMainContainer>
      <PaymentMethodContainer>
        <PaymentOption 
          onClick={() => handleInputChange('payment_type', 'private')}
          $isSelected={formData.payment_type === 'private'}
        >
          <RadioIcon 
            src={formData.payment_type === 'private' ? 
                 Images.instructions.selectRadioIcon : 
                 Images.instructions.unSelectRadioIcon} 
            alt={formData.payment_type === 'private' ? "Selected" : "Unselected"} 
          />
          <PaymentOptionLabel>Private</PaymentOptionLabel>
        </PaymentOption>
        
        <PaymentOption 
          onClick={() => handleInputChange('payment_type', 'legal_aid')}
          $isSelected={formData.payment_type === 'legal_aid'}
        >
          <RadioIcon 
            src={formData.payment_type === 'legal_aid' ? 
                 Images.instructions.selectRadioIcon : 
                 Images.instructions.unSelectRadioIcon} 
            alt={formData.payment_type === 'legal_aid' ? "Selected" : "Unselected"} 
          />
          <PaymentOptionLabel>Legal Aid</PaymentOptionLabel>
        </PaymentOption>
      </PaymentMethodContainer>

      <RecipientDetailsLayout title="Invoice details">

        <InvoiceDetailsContainer>
          <InvoiceLeftColumn>
            <DetailValue>Andrew Garfield</DetailValue>
            <DetailValue>ABC street 4, NY</DetailValue>
          </InvoiceLeftColumn>
          <InvoiceRightColumn>
            <DetailLabel>Invoice no.</DetailLabel>
            <DetailValue>51026712</DetailValue>
          </InvoiceRightColumn>
        </InvoiceDetailsContainer>

        <Divider />

        <ClientReceipentInfoContainer>
          {/* Client Contact Info */}
          <InfoSection>
            <DetailLabel>Client contact info</DetailLabel>
            <DetailValue>Andrew Garfield</DetailValue>
            <DetailValue>andrew@example.com</DetailValue>
            <DetailValue>+44 20 7946 0958</DetailValue>
            <DetailValue>ABC street 4, NY</DetailValue>
          </InfoSection>

          {/* Bill To */}
          <InfoSection>
            <DetailLabel>Bill to</DetailLabel>
            <DetailValue>WeProcess Ltd</DetailValue>
            <DetailValue>accounts@weprocess.com</DetailValue>
            <DetailValue>+44 20 7946 0000</DetailValue>
            <DetailValue>123 Business Ave, London</DetailValue>
          </InfoSection>

          {/* Client Name Details */}
          <ClientNameSection>
            <DetailRow>
              <DetailLabel>Client name</DetailLabel>
              <DetailValue>Andrew Garfield</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Invoice date</DetailLabel>
              <DetailValue>May 10, 2025</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Due date</DetailLabel>
              <DetailValue>May 24, 2025</DetailValue>
            </DetailRow>
          </ClientNameSection>
        </ClientReceipentInfoContainer>
      </RecipientDetailsLayout>

      <PaymentContainerTitle>Pay with</PaymentContainerTitle>

      {/* Payment Method Cards */}
      <PaymentCardsContainer>
        <PaymentCard 
          onClick={() => handleInputChange('payment_method', 'apple_pay')}
          $isSelected={formData.payment_method === 'apple_pay'}
        >
          <PaymentCardLeft>
            <RadioIcon 
              src={formData.payment_method === 'apple_pay' ? 
                    Images.instructions.selectRadioIcon : 
                    Images.instructions.unSelectRadioIcon} 
              alt={formData.payment_method === 'apple_pay' ? "Selected" : "Unselected"} 
            />
            <PaymentCardLabel>Pay with Apple Pay</PaymentCardLabel>
          </PaymentCardLeft>
          <AppleIcon src={Images.instructions.applePay} alt="Apple Pay" />
        </PaymentCard>

        <PaymentCard 
          onClick={() => handleInputChange('payment_method', 'google_pay')}
          $isSelected={formData.payment_method === 'google_pay'}
        >
          <PaymentCardLeft>
            <RadioIcon 
              src={formData.payment_method === 'google_pay' ? 
                    Images.instructions.selectRadioIcon : 
                    Images.instructions.unSelectRadioIcon} 
              alt={formData.payment_method === 'google_pay' ? "Selected" : "Unselected"} 
            />
            <PaymentCardLabel>Pay with Google Pay</PaymentCardLabel>
          </PaymentCardLeft>
          <GoogleIcon src={Images.instructions.googlePay} alt="Google Pay" />
        </PaymentCard>

        <PaymentCard 
          onClick={() => handleInputChange('payment_method', 'card')}
          $isSelected={formData.payment_method === 'card'}
        >
          <PaymentCardLeft>
            <RadioIcon 
              src={formData.payment_method === 'card' ? 
                    Images.instructions.selectRadioIcon : 
                    Images.instructions.unSelectRadioIcon} 
              alt={formData.payment_method === 'card' ? "Selected" : "Unselected"} 
            />
            <PaymentCardLabel>Pay with Card</PaymentCardLabel>
          </PaymentCardLeft>
          <CardIcon src={Images.instructions.creditCard} alt="Credit Card" />
        </PaymentCard>
      </PaymentCardsContainer>
    </InstructionsMainContainer>
  );
};

const InvoiceDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const InvoiceLeftColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InvoiceRightColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClientReceipentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;

    @media (max-width: 1280px) {
    gap: 16px;
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  flex: 1;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ClientNameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 22px;

  @media (max-width: 480px) {
    align-items: flex-start;
    gap: 4px;
    height: auto;
  }
`;

const DetailLabel = styled.div`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #656565;
  text-wrap: nowrap;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const DetailValue = styled.div`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #333333;
  text-wrap: nowrap;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const PaymentContainerTitle = styled.div`
  font-family: Manrope;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  display: flex;
  align-self: flex-start
`;

const PaymentMethodContainer = styled.div`
  width: 191px;
  height: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-self: flex-start;
`;

const PaymentCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const PaymentCard = styled.div`
  width: 393px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${props => props.$isSelected ? '#043F35' : '#E5E7EB'};
  padding: 16px;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? '#F0F6E3' : '#FFFFFF'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #043F35;
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const PaymentCardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PaymentCardLabel = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #121F24;
`;

const AppleIcon = styled.img`
  width: 21px;
  height: 24px;
`;

const GoogleIcon = styled.img`
  width: 21px;
  height: 24px;
`;

const CardIcon = styled.img`
  width: 22px;
  height: 25px;
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

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${props => props.$isSelected ? '#043F35' : '#656565'};
  transition: color 0.2s ease;

  &:hover {
    color: #043F35;
  }
`;

const PaymentOptionLabel = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  text-wrap: nowrap;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E4E8EE;
`;
