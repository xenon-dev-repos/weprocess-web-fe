// Step6Confirmation.js
import React from 'react';
import { InstructionsMainContainer } from '../../styles/Shared';
import { useInstruction } from '../../contexts/InstructionContext';
import { SharedInstructionInvoiceDetails } from './SharedInstructionInvoiceDetails';

export const Step6Confirmation = () => {
  const { formData } = useInstruction();

  return (
    <InstructionsMainContainer>
      <SharedInstructionInvoiceDetails formData={formData} isAddNewInstructionStep6={true}/>
    </InstructionsMainContainer>
  );
};