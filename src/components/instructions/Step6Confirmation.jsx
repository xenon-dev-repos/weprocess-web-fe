// Step6Confirmation.js
import React from 'react';
import { InstructionsMainContainer } from '../../styles/Shared';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout';
import { useInstruction } from '../../contexts/InstructionContext';
import { FieldRow } from '../shared/FieldRow';
import { DisplayField } from '../shared/DisplayField';

export const Step6Confirmation = () => {
  const { formData } = useInstruction();

  // Format phone numbers for display
  const formatPhoneDisplay = (phone) => {
    if (!phone) return '-';
    // Add your phone formatting logic here
    return phone;
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return '-';
    // Add your date formatting logic here
    return date;
  };

  return (
    <InstructionsMainContainer>
      <RecipientDetailsLayout title="Recipient info">
        <FieldRow>
          <DisplayField label="Full name" value={formData.recipient_name} />
          <DisplayField label="Email address" value={formData.recipient_email} />
        </FieldRow>
        <FieldRow>
          <DisplayField label="Contact number" value={formatPhoneDisplay(formData.recipient_phone)} />
          <DisplayField label="Address" value={formData.recipient_address} />
        </FieldRow>
      </RecipientDetailsLayout>


      <RecipientDetailsLayout title="Serve info">
        <FieldRow>
          <DisplayField label="Serve Type" value={formData.service_type} />
          <DisplayField label="Service type" value={formData.service_type} />
        </FieldRow>

        {/* <FieldRow>
          <DisplayField label="Priority" value={formData.priority} />
          <DisplayField label="Deadline" value={formData.deadline} />
        </FieldRow>

       <FieldRow>
          <DisplayField label="Attempts Allowed" value={formData.attempts_allowed} />
        </FieldRow> */}

      </RecipientDetailsLayout>


      <RecipientDetailsLayout title="Court info">
        <FieldRow>
          <DisplayField label="Issuing court" value={formData.issuing_court} />
          <DisplayField label="Court case number" value={formData.court_case_number} />
        </FieldRow>
        <FieldRow>
          <DisplayField label="Date of submission" value={formatDateDisplay(formData.date_of_submission)} />
          <DisplayField label="Date of next hearing" value={formatDateDisplay(formData.date_of_next_hearing)} />
        </FieldRow>
      </RecipientDetailsLayout>


      <RecipientDetailsLayout title="Payment details">
        <FieldRow>
          <DisplayField label="Applicant name" value={formData.applicant_name} />
          <DisplayField label="Applicant email" value={formData.applicant_email} />
        </FieldRow>
        <FieldRow>
          <DisplayField label="Applicant phone" value={formatPhoneDisplay(formData.applicant_phone)} />
          <DisplayField label="Applicant address" value={formData.applicant_address} />
        </FieldRow>
      </RecipientDetailsLayout>
    </InstructionsMainContainer>
  );
};