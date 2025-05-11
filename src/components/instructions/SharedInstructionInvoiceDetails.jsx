import React from 'react';
import { FieldRow } from '../shared/FieldRow.jsx';
import { DisplayField } from '../shared/DisplayField.jsx';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout.jsx';
import { formatDateDisplay, formatPhoneDisplay } from '../../utils/helperFunctions.js';
import styled from 'styled-components';
import { CustomDivider } from '../../styles/Shared.js';

export const SharedInstructionInvoiceDetails = ({ 
    formData, 
    isInvoiceDetails = false, 
    isInstructionDetails = false, 
    isAddNewInstructionStep5 = false,
    // isAddNewInstructionStep6 = false 
}) => {
  return (
    <>
        {(isInvoiceDetails || isAddNewInstructionStep5) &&
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

            <CustomDivider />

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
        }

        {isInstructionDetails &&
            <RecipientDetailsLayout title="Applicant info">
            <FieldRow>
                <DisplayField label="Full name" value={formData.recipient_name} />
                <DisplayField label="Email address" value={formData.recipient_email} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Contact number" value={formatPhoneDisplay(formData.recipient_phone)} />
                <DisplayField label="Address" value={formData.recipient_address} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Additional details" value={formatPhoneDisplay(formData.recipient_name)} />
            </FieldRow>
            </RecipientDetailsLayout>
        }

        {!isAddNewInstructionStep5 &&
        <>
            <RecipientDetailsLayout title="Recipient info">
            <FieldRow>
                <DisplayField label="Full name" value={formData.recipient_name} />
                <DisplayField label="Email address" value={formData.recipient_email} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Contact number" value={formatPhoneDisplay(formData.recipient_phone)} />
                <DisplayField label="Address" value={formData.recipient_address} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Additional details" value={formatPhoneDisplay(formData.recipient_name)} />
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

            {(isInstructionDetails || isInvoiceDetails) ? 
              <RecipientDetailsLayout title="Payment Info">
                <FieldRow>
                    <DisplayField label="Applicant name" value={formData.applicant_name} />
                </FieldRow>
              </RecipientDetailsLayout> 
              :
              <RecipientDetailsLayout title="Payment details">
                <FieldRow>
                    <DisplayField label="Account name" value={formData.applicant_name} />
                    <DisplayField label="Account number" value={formData.applicant_email} />
                </FieldRow>
                <FieldRow>
                    <DisplayField label="Billing Address" value={formatPhoneDisplay(formData.applicant_phone)} />
                    <DisplayField label="Sort code" value={formData.applicant_address} />
                </FieldRow>
                <FieldRow>
                    <DisplayField label="Bank" value={formData.applicant_name} />
                </FieldRow>
              </RecipientDetailsLayout>
            }
        </>
        }
    </>
  );
};

const ClientReceipentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  max-width: 1180px;

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

const InvoiceDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  max-width: 1180px;

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
