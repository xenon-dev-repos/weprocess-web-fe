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

const InstructionDetailsPage = () => {
  const { id } = useParams();
  const { formData, fetchServeById, currentServeData, isLoading, } = useInstruction();
  const [layoutData, setLayoutData] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  // Set app element for react-modal (for accessibility)
  Modal.setAppElement('#root'); // Make sure this matches your root element ID
}, []);

  useEffect(() => {
    const loadServe = async () => {
      try {
        if (id) {
          await fetchServeById(id);
        }
      } catch (error) {
        console.error(error, 'Error occurred while getting serve data.');
      }
    };
    
    loadServe();
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
                  formData.documents.map((doc, index) => (
                    <DocRow key={doc.id}>
                      <DocInfoContainer 
                        onClick={() => {
                          if (formData.document_urls && formData.document_urls[index]) {
                            setSelectedDoc({
                              name: doc.name,
                              url: formData.document_urls[index]
                            });
                            setPageNumber(1);
                            setIsModalOpen(true);
                          }
                        }}
                        style={{ 
                          cursor: formData.document_urls && formData.document_urls[index] ? 'pointer' : 'default',
                          opacity: formData.document_urls && formData.document_urls[index] ? 1 : 0.7
                        }}
                      >
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
        contentLabel="Document Viewer"
      >
        {selectedDoc && (
          <DocumentViewerContainer>
            <Document
              file={selectedDoc.url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<div>Loading PDF...</div>}
              error={<div>Failed to load PDF.</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                width={Math.min(window.innerWidth * 0.8, 800)}
                loading={<div>Loading page...</div>}
              />
            </Document>
            <DocumentControls>
              <NavButton 
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
              >
                Previous
              </NavButton>
              <PageInfo>
                Page {pageNumber} of {numPages || '--'}
              </PageInfo>
              <NavButton 
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
              >
                Next
              </NavButton>
            </DocumentControls>
            <CloseButton onClick={() => setIsModalOpen(false)}>Close</CloseButton>
          </DocumentViewerContainer>
        )}
      </Modal>

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

// Modal styles
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    padding: '20px',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};

const DocumentViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const DocumentControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 15px 0;
  width: 100%;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #333;
  min-width: 100px;
  text-align: center;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 14px;
  align-self: flex-end;
  
  &:hover {
    background: #d32f2f;
  }
`;

export default InstructionDetailsPage;
