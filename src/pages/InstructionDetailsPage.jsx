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
import { useLocation } from 'react-router-dom';

const InstructionDetailsPage = () => {
  const location = useLocation();
  const { state } = location;
  const wprNo = state?.['WPR no.'];
  const { formData, fetchServeById, currentServeData, isLoading, } = useInstruction();
  const [layoutData, setLayoutData] = useState(null);

  useEffect(() => {
    const loadServe = async () => {
      try {
        if (wprNo) {
           console.log(wprNo, ' This is wprNo.');
          await fetchServeById(wprNo);
        }
      } catch (error) {
        console.error(error, 'Error occurred while getting serve data.');
      }
    };
    
    loadServe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wprNo]);

  useEffect(() => {
    if (currentServeData) {
      setLayoutData({
        id: currentServeData?.id,
        recipient_name: currentServeData?.recipient_name,
        priority: currentServeData?.priority
      });
    }
  }, [currentServeData]);
  
  return (
    <MainLayout title="Instruction Details" isInstructionDetailsPage={true} instructionData={layoutData}>
      <LayoutContainer>
        {isLoading && <LoadingOnPage />}
        {/* LEFT SECTION */}
        <ContentSection>
          <ContentSectionHeader style={{height: '80px'}}>
              <ContentSectionTitle>Instruction Details</ContentSectionTitle>
          </ContentSectionHeader>

          <InstructionsDetailMainContainer>
            {currentServeData ? (
              <>
                {/* <UploadedDocsContainer>
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
              </UploadedDocsContainer> */}
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
              <SharedInstructionInvoiceDetails formData={ formData } isInstructionDetails={true} />
              </>

            ) : (
              <>
                {!isLoading && !currentServeData && (
                <NoDataContainer>
                  <NoDataMessage>No data available</NoDataMessage>
                </NoDataContainer>
                )}
              </>
            )}



          </InstructionsDetailMainContainer>
        </ContentSection>

        {/* Right SECTION */}
        {currentServeData?.serve?.user &&
          <SideBarSectionRightMain>
            <SideBarSectionRight $height={'395px'} $drawerOpen={false}>
              <ProfileSidebar userData={currentServeData?.serve?.user}/>
            </SideBarSectionRight>

            <SideBarSectionSecond $height={'530px'} $drawerOpen={false}>
            <AttemptDetails attempts={currentServeData?.serve?.attempts || []}/>
            </SideBarSectionSecond>
          </SideBarSectionRightMain>
        }

      </LayoutContainer>
    </MainLayout>
  );
};

const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const NoDataMessage = styled.p`
  font-size: 18px;
  color: #656565;
  text-align: center;
`;

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
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const DocRow = styled.div`
  display: flex;
`;

const DocInfoContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 20px;
  border: 1px solid #ccc;
  padding: 24px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Added box shadow */

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    padding: 20px 8px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* Adjusted for smaller screens */
  }

  @media (max-width: 480px) {
    width: 130px;
    height: 130px;
    padding: 16px 8px;
    gap: 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Adjusted for mobile */
  }
`;

const DocLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const DocImage = styled.img`
  width: 67px;
  height: 67px;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 55px;
    height: 55px;
  }
`;

const DocTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: center;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const DocName = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 120%;
  color: #242331;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 4px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const DocSize = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 120%;
  color: #656565;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export default InstructionDetailsPage;
