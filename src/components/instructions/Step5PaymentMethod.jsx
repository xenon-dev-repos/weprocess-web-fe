// Step5PaymentMethod.js
import React from 'react';
import { CustomDivider, InstructionsMainContainer } from '../../styles/Shared';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout';
import { useInstruction } from '../../contexts/InstructionContext';
import { Images } from '../../assets/images';
import styled from 'styled-components';
import { SharedInstructionInvoiceDetails } from './SharedInstructionInvoiceDetails';

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

      {/* shared InvoiceDetails component */}
      <SharedInstructionInvoiceDetails formData={formData} isAddNewInstructionStep5={true} />

      <CustomDivider />

      <PaymentContainerTitle>Pay with</PaymentContainerTitle>

      {/* Payment Method Cards */}
      <PaymentCardsContainer>
        {/* <PaymentCard 
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
        </PaymentCard> */}

        {/* <PaymentCard 
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
        </PaymentCard> */}

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
