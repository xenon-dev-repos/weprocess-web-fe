// Step3RecipientDetails.js
import React from 'react';
import { InstructionsMainContainer } from '../../styles/Shared';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout';
import { InputFieldsContainer } from '../shared/InputFieldsContainer';
import { Images } from '../../assets/images';
import { useInstruction } from '../../contexts/InstructionContext';
import { FormGroup, Input, Label, TextArea } from '../shared/FormElements';
import { StepValidation } from './StepValidation';

export const Step3RecipientDetails = () => {
  const { 
    formData, 
    handleInputChange,
    handleDateChange,
    applicantPhoneNumber,
    recipientPhoneNumber,
    applicantPhoneInputRef,
    recipientPhoneInputRef,
  } = useInstruction();

  const applicantFields = [
    {
      label: 'Full name',
      name: 'applicant_name',
      placeholder: 'Enter full name',
      required: true
    },
    {
      label: 'Email address (optional)',
      name: 'applicant_email',
      placeholder: 'Enter email address',
      type: 'email'
    }
  ];

  const applicantContactFields = [
    {
      label: 'Contact number',
      name: 'applicant_phone',
      placeholder: '020 7946 0958',
      type: 'phone',
      countryCode: '+44',
      flagIcon: Images.auth.ukFlag,
      required: true,
      phoneNumber: applicantPhoneNumber,
      phoneInputRef: applicantPhoneInputRef
    },
    {
      label: 'Address',
      name: 'applicant_address',
      placeholder: 'Enter full address',
      required: true
    }
  ];

  const recipientFields = [
    {
      label: 'Full name',
      name: 'recipient_name',
      placeholder: 'Enter full name',
      required: true
    },
    {
      label: 'Email address (optional)',
      name: 'recipient_email',
      placeholder: 'Enter email address',
      type: 'email'
    }
  ];

  const recipientContactFields = [
    {
      label: 'Contact number',
      name: 'recipient_phone',
      placeholder: '020 7946 0958',
      type: 'phone',
      countryCode: '+44',
      flagIcon: Images.auth.ukFlag,
      required: true,
      phoneNumber: recipientPhoneNumber,
      phoneInputRef: recipientPhoneInputRef
    },
    {
      label: 'Address',
      name: 'recipient_address',
      placeholder: 'Enter full address',
      required: true
    }
  ];

  const caseFields = [
    {
      label: 'Issuing court',
      name: 'issuing_court',
      placeholder: 'Enter issuing court',
      required: true
    },
    {
      label: 'Court case number',
      name: 'court_case_number',
      placeholder: 'Enter case number',
      required: true
    }
  ];

  const caseFieldsDate = [
    {
      label: 'Date of submission',
      name: 'date_of_submission',
      type: 'date',
      required: true
    },
    {
      label: 'Date of next hearing',
      name: 'date_of_next_hearing',
      type: 'date',
      required: true
    }
  ];

  return (
    <StepValidation step={3}>
      <InstructionsMainContainer>
        <RecipientDetailsLayout title="Applicant info">
          <InputFieldsContainer
            fields={applicantFields}
            formData={formData}
            handleChange={handleInputChange}
          />
          <InputFieldsContainer
            fields={applicantContactFields}
            formData={formData}
            handleChange={handleInputChange}
          />
        </RecipientDetailsLayout>

        <RecipientDetailsLayout title="Recipient info">
          <InputFieldsContainer 
            fields={recipientFields}
            formData={formData}
            handleChange={handleInputChange}
          />
          <InputFieldsContainer 
            fields={recipientContactFields}
            formData={formData}
            handleChange={handleInputChange}
          />
          {/* <InputFieldsContainer 
            fields={recipientAdditionalDetails}
            formData={formData}
            handleChange={handleInputChange}
          /> */}
          <FormGroup $marginBottom='0'>
            <Label>
            Additional details
            </Label>
            <TextArea
              type={'text'}
              name={'recipient_additional_details'}
              placeholder={'Please enter other specifies regarding this case, if any...'}
              value={formData.recipient_additional_details || ''}
              onChange={handleInputChange}
              required
              $height="76px"
            />
          </FormGroup>
        </RecipientDetailsLayout>

        <RecipientDetailsLayout title="Case info">
          <InputFieldsContainer 
            fields={caseFields}
            formData={formData}
            handleChange={handleInputChange}
          />
          <InputFieldsContainer 
            fields={caseFieldsDate}
            formData={formData}
            handleDateChange={handleDateChange}
            handleChange={handleInputChange}
          />
        </RecipientDetailsLayout>
      </InstructionsMainContainer>
    </StepValidation>
  );
};
