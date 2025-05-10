// Step2ServeType.js
import React from 'react';
import styled from 'styled-components';
import { InstructionsMainContainer } from '../../styles/Shared';
import { FormGroup2, Input, Label } from '../shared/FormElements';
import { useInstruction } from '../../contexts/InstructionContext';

export const Step2ServeType = () => {
  const { 
    formData, 
    handleDocTypeSelect, 
    handleReasonChange,
    handleInputChange 
  } = useInstruction();

  const documentTypes = [
    'Divorce Petition',
    'Non-Molestation Order',
    'Possession Notice',
    'Injunction',
    'Statutory Demand',
    'Bankruptcy Petition',
    'Child Arrangements Order',
    'Witness Summons',
    'Other (Please Specify)'
  ];

  const isSelected = (type) => {
    return formData.document_types.includes(type);
  };

  const showReasonInput = formData.document_types.includes('Other (Please Specify)');

  return (
    <InstructionsMainContainer>
      <CaseNameAndOwner>
        <FormGroup2>
          <Label>Case name</Label>
          <Input
            type="text"
            name="caseName"
            placeholder="Enter serve name"
            value={formData.caseName || ''}
            onChange={(e) => handleInputChange('caseName', e.target.value)}
            required
            $height="56px"
          />
        </FormGroup2>

        <FormGroup2>
          <Label>Owner</Label>
          <Input
            type="text"
            name="owner"
            placeholder="Enter owner name"
            value={formData.owner || ''}
            onChange={(e) => handleInputChange('owner', e.target.value)}
            required
            $height="56px"
          />
        </FormGroup2>
      </CaseNameAndOwner>

      <Label style={{marginBottom: -5, display: 'flex', justifySelf: 'flex-start', width: '100%'}}>Select all relevant document types that you are serving.</Label>

      <DocumentTypeContainer>
        {documentTypes.map((type) => (
          <DocumentTypeOption
            key={type}
            $selected={isSelected(type)}
            onClick={() => handleDocTypeSelect(type)}
          >
            {type}
          </DocumentTypeOption>
        ))}
      </DocumentTypeContainer>

      {showReasonInput && (
        <OtherSpecifyInput
          type="text"
          placeholder="Please specify a reason"
          value={formData.reason || ''}
          onChange={(e) => handleReasonChange(e.target.value)}
        />
      )}
    </InstructionsMainContainer>
  );
};

const CaseNameAndOwner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;

  @media (max-width: 1440px) {
    gap: 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
  }

  @media (max-width: 1024px) {
    gap: 18px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DocumentTypeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const DocumentTypeOption = styled.div`
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.8;
  border: 1px solid ${props => props.$selected ? '#126456' : '#E5E5E5'};
  padding: 16px 24px;
  background-color: ${props => props.$selected ? '#126456' : '#F5F5F5'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  color: ${props => props.$selected ? '#FFFFFF' : '#333333'};

  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  @media (max-width: 1024px) {
    padding: 14px 20px;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
    height: 48px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
    height: 44px;
    border-radius: 12px;
  }
`;

const OtherSpecifyInput = styled.input`
  width: 100%;
  height: 56px;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
  padding: 16px 24px;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: #242331;
  margin-top: 8px;

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 14px;
    padding: 12px 16px;
  }
`;