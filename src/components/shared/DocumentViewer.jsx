import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Modal from 'react-modal';
import { getFileTypeIcon } from '../../utils/helperFunctions';

const getFileTypeFromUrl = (url) => {
  if (!url) return '';
  const cleanUrl = url.split('?')[0];
  return cleanUrl.split('.').pop().toLowerCase();
};

const DocumentViewer = ({ documents = [], documentUrls = [] }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Initialize PDF worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    Modal.setAppElement('#root');
  }, []);

  const handleDocumentClick = (doc, url) => {
    if (!url) return;
    
    const fileType = getFileTypeFromUrl(url);
    setSelectedDoc({
      name: doc.name,
      url: url,
      type: fileType
    });
    setPageNumber(1);
    setImageLoadError(false);
    setPdfLoadError(false);
    setPdfLoaded(false);
    
    if (fileType === 'pdf') {
      setModalContentType('pdf');
    } else if (['jpeg', 'jpg', 'png', 'gif'].includes(fileType)) {
      setModalContentType('image');
    } else {
      setModalContentType('other');
    }
    
    setIsModalOpen(true);
  };

  const handleImageError = () => setImageLoadError(true);
  const handlePdfError = () => setPdfLoadError(true);

  return (
    <>
      <UploadedDocsContainer>
        {documents.map((doc, index) => {
          const fileUrl = documentUrls[index];
          const fileType = fileUrl ? getFileTypeFromUrl(fileUrl) : '';
          
          return (
            <DocRow key={doc.id || index}>
              <DocInfoContainer 
                onClick={() => handleDocumentClick(doc, fileUrl)}
                style={{ 
                  cursor: fileUrl ? 'pointer' : 'default',
                  opacity: fileUrl ? 1 : 0.7
                }}
              >
                <DocLeft>
                  <DocImage src={getFileTypeIcon(fileType)} alt="Document" />
                  <DocTextGroup>
                    <DocName>{doc.name || 'Document'}</DocName>
                    <DocSize>{doc.size || '1mb'}</DocSize>
                  </DocTextGroup>
                </DocLeft>
              </DocInfoContainer>
            </DocRow>
          );
        })}
      </UploadedDocsContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
        contentLabel="Document Viewer"
      >
        {selectedDoc && (
          <DocumentViewerContainer>
            {modalContentType === 'pdf' && (
              <PdfViewerContainer>
                {pdfLoadError ? (
                  <ErrorContainer>
                    <FileIcon src={getFileTypeIcon('pdf')} alt="PDF icon" />
                    <FileMessage>Failed to load PDF</FileMessage>
                    <DownloadButton 
                      href={selectedDoc.url} 
                      download={selectedDoc.name}
                    >
                      Download PDF
                    </DownloadButton>
                  </ErrorContainer>
                ) : (
                  <>
                    <Document
                      file={selectedDoc.url}
                      onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setPdfLoaded(true);
                        document.querySelector('.react-pdf__Document')?.classList.add('loaded');
                      }}
                      onLoadError={() => {
                        handlePdfError();
                        setPdfLoaded(true);
                      }}
                      loading={<LoadingMessage>Preparing document...</LoadingMessage>}
                      className="react-pdf__Document"
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        width={Math.min(window.innerWidth * 0.8, 800)}
                        loading={<LoadingMessage>Loading page...</LoadingMessage>}
                      />
                    </Document>

                    {pdfLoaded && numPages && (
                      <DocumentControls>
                        <NavButton 
                          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                          disabled={pageNumber <= 1}
                        >
                          Previous
                        </NavButton>
                        <PageInfo>
                          Page {pageNumber} of {numPages}
                        </PageInfo>
                        <NavButton 
                          onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                          disabled={pageNumber >= numPages}
                        >
                          Next
                        </NavButton>
                      </DocumentControls>
                    )}
                  </>
                )}
              </PdfViewerContainer>
            )}

            {modalContentType === 'image' && (
              <ImagePreviewContainer>
                <img 
                  src={selectedDoc.url} 
                  alt={selectedDoc.name}
                  onLoad={(e) => e.currentTarget.classList.add('loaded')}
                  onError={handleImageError}
                />
                {imageLoadError && (
                  <ErrorContainer>
                    <FileIcon src={getFileTypeIcon(selectedDoc.type)} alt="Image icon" />
                    <FileMessage>Failed to load image</FileMessage>
                    <DownloadButton 
                      href={selectedDoc.url} 
                      download={selectedDoc.name}
                    >
                      Download Image
                    </DownloadButton>
                  </ErrorContainer>
                )}
              </ImagePreviewContainer>
            )}

            {modalContentType === 'other' && (
              <OtherFileContainer>
                <div className="file-content loaded">
                  <FileIcon src={getFileTypeIcon(selectedDoc.type)} alt="File icon" />
                  <FileName>{selectedDoc.name}</FileName>
                  <FileMessage>
                    This file type cannot be previewed. <br/> Please download it.
                  </FileMessage>
                  <DownloadButton 
                    href={selectedDoc.url} 
                    download={selectedDoc.name}
                  >
                    Download File
                  </DownloadButton>
                </div>
              </OtherFileContainer>
            )}      
            <CloseButton onClick={() => setIsModalOpen(false)}>Close</CloseButton>
          </DocumentViewerContainer>
        )}
      </Modal>
    </>
  );
};

// Styles (can be moved to a separate file if preferred)
const modalStyles = {
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


const DocumentControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 15px 0;
  width: 100%;
  z-index: 3;
  position: relative;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  width: 100%;
  min-height: inherit; // Takes parent's height
  z-index: 2;
  position: relative;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  min-width: 300px;
  max-width: 800px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Base container styles for all document types
const DocumentContainer = styled.div`
  width: 100%;
  min-width: 350px;
  // max-width: 800px;
  min-height: 300px; 
  // max-height: 80vh;
  margin: 0 auto;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // Loading skeleton (shown while content loads)
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
    z-index: 1;
    transition: opacity 0.3s ease;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// PDF-specific container
const PdfViewerContainer = styled(DocumentContainer)`
  .react-pdf__Document {
    width: 100%;
    transition: opacity 0.3s ease;
    opacity: 0;
    z-index: 2;
    position: relative;
    
    &.loaded {
      opacity: 1;
      
      & + ::before {
        opacity: 0;
      }
    }
  }
`;

// Image-specific container (modified from previous)
const ImagePreviewContainer = styled(DocumentContainer)`
  img {
    max-width: 100%;
    max-height: 80vh;
    transition: all 0.3s ease;
    opacity: 0;
    position: relative;
    z-index: 2;
    border-radius: 8px;
    
    &.loaded {
      opacity: 1;
      
      & + ::before {
        opacity: 0;
      }
    }
  }
`;

// Other file container
const OtherFileContainer = styled(DocumentContainer)`
  .file-content {
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
    position: relative;
    text-align: center;
    width: 100%;
    
    &.loaded {
      opacity: 1;
      
      & + ::before {
        opacity: 0;
      }
    }
  }
`;


const FileIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const FileName = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const FileMessage = styled.p`
  margin-bottom: 20px;
  color: #666;
  max-width: 400px;
`;

const DownloadButton = styled.a`
  padding: 10px 20px;
  background-color: #126456;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0f4e3c;
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    padding: 20px 8px;
    
    &:hover {
      transform: translateY(-4px);
    }
  }

  @media (max-width: 480px) {
    width: 130px;
    height: 130px;
    padding: 16px 8px;
    gap: 12px;
    
    &:hover {
      transform: translateY(-3px);
    }
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

const DocumentViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
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

export default DocumentViewer;