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
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Modal from 'react-modal';
import { useNavigation } from '../hooks/useNavigation.js';
import DocumentViewer from '../components/shared/DocumentViewer.jsx';

const InstructionDetailsPage = () => {
  const { id } = useParams();
  const navigation = useNavigation();
  const { formData, fetchServeById, currentServeData, isLoading } = useInstruction();
  const [layoutData, setLayoutData] = useState(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadServe = async () => {
      try {
        if (id) {
          await fetchServeById(id);
        }
      } catch (error) {
        console.error(error, 'Error occurred while getting serve data.');
      }
    };
    
    if (isMounted) {
      loadServe();
    }
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (currentServeData) {
      setLayoutData({
        id: currentServeData?.id,
        title: currentServeData?.title,
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
              <ViewInvoicesBtnContainer onClick={() => navigation.navigateToInvoiceDetails({id})}>
                <ViewInvoicesBtnIcon src={Images.shared.eyeIcon} alt="View Invoices" />
                <ViewInvoicesBtnText>View Invoices</ViewInvoicesBtnText>
              </ViewInvoicesBtnContainer>

              <DocumentViewer
                documents={formData.documents}
                documentUrls={formData.document_urls}
              />

              <SharedInstructionInvoiceDetails formData={formData} isInstructionDetails={true} />
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

const ViewInvoicesBtnContainer = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;
  text-wrap: nowrap;
`;

const ViewInvoicesBtnIcon = styled.img`
  width: 18px;
  height: 12px;
`;

const ViewInvoicesBtnText = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0;
  color: #126456;
  text-align: right;
  vertical-align: middle;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    scale: 1.01;
    color: #0f4e3c;
  }
`;

export default InstructionDetailsPage;
