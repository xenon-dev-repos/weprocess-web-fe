import React from 'react';
import { FieldRow } from '../shared/FieldRow.jsx';
import { DisplayField } from '../shared/DisplayField.jsx';
import { RecipientDetailsLayout } from '../../layouts/RecipientDetailsLayout.jsx';
import { capitalizeFirstLetter, formatDate, formatDateDisplay, formatDocumentTypesForDisplay, formatPhoneDisplay } from '../../utils/helperFunctions.jsx';
import styled from 'styled-components';
import { CustomDivider } from '../../styles/Shared.js';

export const SharedInstructionInvoiceDetails = ({ 
    formData, 
    isInvoiceDetails = false, 
    isInstructionDetails = false, 
    isAddNewInstructionStep5 = false,
    // isAddNewInstructionStep6 = false 
    currentInvoiceData = null,
}) => {

  return (
    <>
        {(isAddNewInstructionStep5 || (isInvoiceDetails && currentInvoiceData)) &&
            <RecipientDetailsLayout title="Invoice details">
                <InvoiceDetailsContainer>
                    <InvoiceLeftColumn>
                        <DetailValue>{formData.applicant_name || '-'}</DetailValue>
                        <DetailValue>{formData.applicant_address || '-'}</DetailValue>
                    </InvoiceLeftColumn>
                    <InvoiceRightColumn>
                        {/* TODO: Invoice number approach to be finalized later. */}
                        {/* <DetailLabel>Invoice no.</DetailLabel>
                        <DetailValue>{isAddNewInstructionStep5 ? "TEST-9876" : currentInvoiceData?.invoice_number}</DetailValue> */}
                    </InvoiceRightColumn>
                </InvoiceDetailsContainer>

                <CustomDivider />

                <ClientReceipentInfoContainer>
                    {/* Client Contact Info */}
                    <InfoSection>
                        <DetailLabel>Client contact info</DetailLabel>
                        <DetailValue>{formData.applicant_name || '-'}</DetailValue>
                        <DetailValue>{formData.applicant_email || '-'}</DetailValue>
                        <DetailValue>{formatPhoneDisplay(formData.applicant_phone) || '-'}</DetailValue>
                        <DetailValue>{formData.applicant_address || '-'}</DetailValue>
                    </InfoSection>

                    {/* Bill To */}
                    <InfoSection>
                        <DetailLabel>Bill to</DetailLabel>
                        <DetailValue>WeProcess Ltd</DetailValue>
                        <DetailValue>accounts@weprocess.com</DetailValue>
                        <DetailValue>+44-20-7946-0000</DetailValue>
                        <DetailValue>123 Business Ave, London</DetailValue>
                    </InfoSection>

                    {/* Client Name Details */}
                    <ClientNameSection>
                        <DetailRow>
                            <DetailLabel>Client name</DetailLabel>
                            <DetailValue>{formData.applicant_name || '-'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                            <DetailLabel>Invoice date</DetailLabel>
                            <DetailValue>{formatDate(new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            }))}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                            <DetailLabel>Due date</DetailLabel>
                            <DetailValue>
                                {formData.deadline ? formatDate(formData.deadline) : '-'}
                            </DetailValue>
                        </DetailRow>

                        <InvoiceTotalAmountColumn>
                            <InvoiceRightColumn style={{alignItems: 'flex-end'}}>
                                <DetailLabel>Total amount</DetailLabel>
                                <DetailValue>{formData.price ? `£${formData.price}` : '-'}</DetailValue>
                            </InvoiceRightColumn>
                        </InvoiceTotalAmountColumn>
                    </ClientNameSection>
                </ClientReceipentInfoContainer>
            </RecipientDetailsLayout>
        }

        {isInstructionDetails &&
            <RecipientDetailsLayout title="Applicant info">
            <FieldRow>
                <DisplayField label="Full name" value={formData.recipient_name} />
                <DisplayField label="Email address (optional)" value={formData.recipient_email} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Contact number" value={formatPhoneDisplay(formData.recipient_phone)} />
                <DisplayField label="Address" value={formData.recipient_address} />
            </FieldRow>
            {/* <FieldRow>
                <DisplayField label="Additional details" value={formData.instructions} />
            </FieldRow> */}
            </RecipientDetailsLayout>
        }

        {!isAddNewInstructionStep5 &&
        <>
            <RecipientDetailsLayout title="Recipient info">
            <FieldRow>
                <DisplayField label="Full name" value={formData.recipient_name} />
                <DisplayField label="Email address (optional)" value={formData.recipient_email} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Contact number" value={formatPhoneDisplay(formData.recipient_phone)} />
                <DisplayField label="Address" value={formData.recipient_address} />
            </FieldRow>
            <FieldRow>
                <DisplayField label="Additional details" value={formData.recipient_additional_details} />
            </FieldRow>
            </RecipientDetailsLayout>

            <RecipientDetailsLayout title="Serve info">
            <FieldRow>
                <DisplayField label="Serve Type" value={formatDocumentTypesForDisplay(formData.document_types, formData.reason)}  />
                <DisplayField 
                  label="Service type" 
                  value={capitalizeFirstLetter(formData.service_type)} 
                />
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
                    <DisplayField label="Payment Mode" value={formData.payment_mode} />
                </FieldRow>
              </RecipientDetailsLayout> 
              :
              <RecipientDetailsLayout title="Payment details">
                <FieldRow>
                    <DisplayField label="Account name" value={formData.account_name} />
                    <DisplayField label="Account number" value={formData.account_number} />
                </FieldRow>
                <FieldRow>
                    <DisplayField label="Billing Address" value={formatPhoneDisplay(formData.billing_address)} />
                    <DisplayField label="Sort code" value={formData.sort_code} />
                </FieldRow>
                <FieldRow>
                    <DisplayField label="Bank" value={formData.bank_name} />
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

const InvoiceTotalAmountColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  margin-top: 70px;

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
