import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { ContentSection, SideBarSection, SideBarSectionRight } from '../layouts/SubLayout.jsx';
import { ContentSectionHeader, ContentSectionTitle } from '../layouts/AddInstructionLayout.jsx';
import { useInstruction } from '../contexts/InstructionContext.jsx';
import { SharedInstructionInvoiceDetails } from '../components/instructions/SharedInstructionInvoiceDetails.jsx';
import { Images } from '../assets/images/index.js';
import { ProfileSidebar } from '../components/instructions/RiderDetailsProfile.jsx';
import AttemptDetails from '../components/instructions/AttemptDetails.jsx';
import LoadingOnPage from '../components/shared/LoadingOnPage.jsx';

const serveData = {
  "success": true,
  "message": "Serve found",
  "serve": {
    "id": 5,
    "client_id": 5,
    "title": "Serve Title",
    "issuing_court": "Court ABC",
    "court_case_number": "112233",
    "recipient_name": "Recipient Name",
    "recipient_email": "recipient@test.com",
    "recipient_address": "Recipient Address",
    "recipient_phone": "+00000",
    "recipient_additional_details": null,
    "applicant_name": "Applicant Name",
    "applicant_email": "applicant@test.com",
    "applicant_address": "Applicant Address",
    "applicant_phone": "+001212",
    "status": "completed",
    "priority": "low",
    "deadline": "01/01/2026",
    "date_of_next_hearing": "2026-01-01",
    "date_of_submission": "2026-01-01",
    "reason": null,
    "document_types": "Type 1,Type 2",
    "type": "Personal",
    "owner": "",
    "service_type": "standard",
    "attempts_allowed": 3,
    "price": 15,
    "instructions": null,
    "is_approved": 0,
    "is_outstanding": 0,
    "created_at": "2025-05-04T11:31:53.000000Z",
    "updated_at": "2025-05-09T09:55:39.000000Z",
    "document_urls": [
      "http://127.0.0.1:8000/storage/app/public/documents/SRS_document_68175029cbf05.pdf"
    ],
    "attempts": [
      {
        "id": 1,
        "user_serve_id": 2,
        "attempt_number": 1,
        "attempt_date": "2000-01-01",
        "attempt_time": "13:30:00",
        "attempt_location": "New Street",
        "recipient_available": 1,
        "recipient_alternate": null,
        "confirmed_identity": 1,
        "confirmation_methods": [
          "Full Name",
          "DOB"
        ],
        "accepted_documents": 1,
        "evidences": [],
        "signature": null,
        "identity_not_confirmed_reason": null,
        "reason_explanation": null,
        "is_failed": 0,
        "created_at": "2025-05-09T09:55:39.000000Z",
        "updated_at": "2025-05-09T09:55:39.000000Z",
        "laravel_through_key": 5,
        "start_date": "9th May 2025",
        "in_transition_date": "28th April 2025",
        "complete_date": "9th May 2025",
        "evidence_urls": []
      },
      {
        "id": 2,
        "user_serve_id": 2,
        "attempt_number": 2,
        "attempt_date": "2000-01-01",
        "attempt_time": "13:30:00",
        "attempt_location": "New Street",
        "recipient_available": 1,
        "recipient_alternate": null,
        "confirmed_identity": 1,
        "confirmation_methods": [
          "Full Name",
          "DOB"
        ],
        "accepted_documents": 1,
        "evidences": [],
        "signature": null,
        "identity_not_confirmed_reason": null,
        "reason_explanation": null,
        "is_failed": true,
        "created_at": "2025-05-09T09:55:39.000000Z",
        "updated_at": "2025-05-09T09:55:39.000000Z",
        "laravel_through_key": 5,
        "start_date": "20th May 2025",
        "in_transition_date": "28th May 2025",
        "complete_date": "29th May 2025",
        "evidence_urls": [],
        "total_jobs_count": 6,
        "jobs_completed_count": 5,
        "success_rate": 83.329999999999998
      }
    ],
    "user": {
      "id": 1,
      "full_name": "Test User",
      "email": "user@test.com",
      "date_of_birth": "04/01/2000",
      "phone_number": "+00000",
      "address": "Test Address",
      "gender": "male",
      "is_active": 1,
      "is_boarded": 0,
      "rating": "0.00",
      "level": 0,
      "is_verified": 1,
      "type": "individual",
      "exp_month": null,
      "exp_year": null,
      "dbs_file": null,
      "qualification": null,
      "abi_registration": null,
      "identity_photo": null,
      "profile_photo": null,
      "availability": "part_time",
      "fcm_token": "iuashdoihaoi",
      "google_id": null,
      "facebook_id": null,
      "apple_id": null,
      "created_at": "2025-04-25T20:15:54.000000Z",
      "updated_at": "2025-05-08T19:41:08.000000Z",
      "laravel_through_key": 5
    }
  }
}

const InstructionDetailsPage = () => {
  const { formData, fetchServeById, isLoading, } = useInstruction();
  const [ currentServeData ] = useState(serveData);
  
  useEffect(() => {
    const loadServe = async () => {
      try {
        await fetchServeById('5');
      } catch (error) {
        console.error(error, 'Error accured while geting serve data.')
      }
    };
    
    loadServe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout title="Instruction Details" isInstructionDetailsPage={true}>
      <LayoutContainer>
        {isLoading && <LoadingOnPage />}
        {/* LEFT SECTION */}
        <ContentSection>
          <ContentSectionHeader style={{height: '80px'}}>
              <ContentSectionTitle>Instruction Details</ContentSectionTitle>
          </ContentSectionHeader>

          <InstructionsDetailMainContainer>

            <UploadedDocsContainer>
              {formData.documents.length !== 0 && (
                formData.documents.map((doc) => (
                  <DocRow key={doc.id}>
                    <DocInfoContainer>
                      <DocLeft>
                        <DocImage src={Images.instructions.pdfIcon} alt="Doc" />
                        <DocTextGroup>
                          <DocName>{doc.name || 'Document'}</DocName>
                          <DocSize>{doc.size || '1mb'}</DocSize>
                        </DocTextGroup>
                      </DocLeft>
                    </DocInfoContainer>
                  </DocRow>
                ))
              )}
            </UploadedDocsContainer>

            <SharedInstructionInvoiceDetails formData={formData} isInstructionDetails={true} />
          </InstructionsDetailMainContainer>
        </ContentSection>

        {/* Right SECTION */}
        <SideBarSectionRightMain>
          <SideBarSectionRight $height={'395px'} $drawerOpen={false}>
            <ProfileSidebar userData={currentServeData?.serve?.user}/>
          </SideBarSectionRight>

          <SideBarSectionSecond $height={'530px'} $drawerOpen={false}>
          <AttemptDetails attempts={currentServeData?.serve?.attempts || []}/>
          </SideBarSectionSecond>
        </SideBarSectionRightMain>

      </LayoutContainer>
    </MainLayout>
  );
};

export const InstructionsDetailMainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 0px 24px 24px 24px;
  

  @media (max-width: 1440px) {
    gap: 22px;
    padding: 0px 22px 22px 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
    padding: 0px 20px 20px 20px;
  }

  @media (max-width: 1024px) {
    gap: 18px;
    padding: 0px 18px 18px 18px;
  }

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0px 16px 16px 16px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    padding: 0px 14px 14px 14px;
  }
`;

export const SideBarSectionRightMain = styled.div`
  width: 100%;
  max-width: 440px;
  height: auto;
  // max-height: 
  border-radius: 20px;
  gap: 16px;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;
  box-size: border-box;
  align-items: center;

  @media (max-width: 1440px) {
    // padding: 18px;
    // height: 372px;
  }

  @media (max-width: 1280px) {
    // padding: 16px;
    // height: 358px;
  }

  @media (max-width: 1024px) {
    // padding: 16px;
    // height: 330px;
  }

  @media (max-width: 768px) {
    // padding: 16px;
    // height: auto;
  }

  @media (max-width: 480px) {
    // width: 100%;
    // padding: 14px;
  }
`;

export const SideBarSectionSecond = styled.div`
  width: 100%;
  max-width: 440px;
    height: auto;
  max-height: ${props => props.$height ? props.$height : 'auto'};
  border-radius: 20px;
  // padding: 24px;
  gap: 16px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;
  box-size: border-box;
  align-items: center;

  @media (max-width: 1440px) {
    // padding: 18px;
    // height: 372px;
  }

  @media (max-width: 1280px) {
    padding: 16px;
    // height: 358px;
  }

  @media (max-width: 1024px) {
    padding: 16px;
    // height: 330px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    // height: auto;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px;
  }
`;

export const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 24px;
  overflow: hidden;
  position: relative;

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
    flex-direction: column-reverse;
    gap: 16px;
    min-height: auto;
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

const UploadedDocsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DocRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DocInfoContainer = styled.div`
  width: 50%;
  height: 62px;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;

  @media (max-width: 1440px) {
    height: 58px;
    padding: 14px;
  }

  @media (max-width: 1024px) {
    height: 56px;
    padding: 12px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const DocLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1; /* allow this section to grow but also shrink if needed */
  min-width: 0;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DocImage = styled.img`
  width: 40px;
  height: 40px;

  @media (max-width: 1440px) {
    width: 38px;
    height: 38px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const DocTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* critical to allow flex children to truncate */
  flex: 1;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const DocName = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  color: #242331;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1440px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const DocSize = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #656565;

  @media (max-width: 1440px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export default InstructionDetailsPage;
