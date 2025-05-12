// Step1UploadDocuments.jsx
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { InstructionsMainContainer } from '../../styles/Shared';
import { Images } from '../../assets/images/index.js';
import { useInstruction } from '../../contexts/InstructionContext.jsx';

export const Step1UploadDocuments = () => {
  const {
    formData,
    handleDocumentUpload,
    handleReceiptUpload,
    removeDocument,
    handleLabelChange
  } = useInstruction();

  const handleDocumentChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDocumentUpload(e.target.files);
    }
  }, [handleDocumentUpload]);

  const handleReceiptChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleReceiptUpload(e.target.files[0]);
    }
  }, [handleReceiptUpload]);

  const triggerFileInput = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'document' ? '.pdf' : 'image/*';
    input.multiple = type === 'document';
    input.onchange = type === 'document' ? handleDocumentChange : handleReceiptChange;
    input.click();
  };

  return (
    <InstructionsMainContainer>
      <UploadContainer>
        <UploadContent>
          <UploadIcon src={Images.instructions.uploadIcon} alt="Upload" />
          <UploadText>Upload the PDF file here (max 23MB)</UploadText>
          <BrowseLink onClick={() => triggerFileInput('document')}>Browse</BrowseLink>
        </UploadContent>
      </UploadContainer>

      <ReceiptContainer>
        <ReceiptText>Upload receipt photo (optional)</ReceiptText>
        <UploadButton onClick={() => triggerFileInput('receipt')}>
          <UploadSmallIcon src={Images.instructions.uploadIcon} alt="Upload" />
          <span>Upload</span>
        </UploadButton>
      </ReceiptContainer>

      <Divider />

      <UploadedDocsContainer>
        <UploadedDocsTitle>Upload documents</UploadedDocsTitle>
        {formData.documents.length === 0 ? (
          <ReceiptText>No docs added</ReceiptText>
        ) : (
          formData.documents.map((doc) => (
            <DocRow key={doc.id} $hasError={!!formData.labelErrors?.[doc.id]}>
              <DocInfoContainer>
                <DocLeft>
                  <DocImage src={Images.instructions.pdfIcon} alt="Doc" />
                  <DocTextGroup>
                    <DocName>{doc.name}</DocName>
                    <DocSize>{doc.size}</DocSize>
                  </DocTextGroup>
                </DocLeft>
                <CancelIcon 
                  src={Images.instructions.cancelIcon} 
                  alt="Cancel" 
                  onClick={() => removeDocument(doc.id)}
                />
              </DocInfoContainer>
              <LabelInputContainer>
                <LabelInput 
                  placeholder="Provide a document label"
                  value={formData.documentLabels[doc.id] || ''}
                  onChange={(e) => handleLabelChange(doc.id, e.target.value)}
                  $hasError={!!formData.labelErrors?.[doc.id]}
                />
                {formData.labelErrors?.[doc.id] && (
                  <ErrorText>{formData.labelErrors[doc.id]}</ErrorText>
                )}
              </LabelInputContainer>
            </DocRow>
          ))
        )}
      </UploadedDocsContainer>
    </InstructionsMainContainer>
  );
};

const UploadContainer = styled.div`
  width: 100%;
  height: 231px;
  border-radius: 8px;
  border: 1.5px dashed #043F35;
  background-color: #F0F6E3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 40px;
  gap: 24px;

  @media (max-width: 1440px) {
    height: 210px;
    padding: 14px 36px;
    gap: 22px;
  }

  @media (max-width: 1280px) {
    height: 200px;
    padding: 12px 32px;
    gap: 20px;
  }

  @media (max-width: 1024px) {
    height: 190px;
    padding: 12px 28px;
    gap: 18px;
  }

  @media (max-width: 768px) {
    height: 180px;
    padding: 12px 24px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    height: 160px;
    padding: 12px 16px;
    gap: 12px;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const UploadIcon = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const UploadText = styled.p`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #656565;
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 15px;
    line-height: 19px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 17px;
    text-align: center;
  }
`;

const BrowseLink = styled.a`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #043F35;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: initial;
  cursor: pointer;

  &:hover {
    text-decoration-thickness: 2px;
  }

  @media (max-width: 1440px) {
    font-size: 15px;
    line-height: 19px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 17px;
  }
`;

const ReceiptContainer = styled.div`
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

const ReceiptText = styled.p`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #656565;
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 15px;
    line-height: 19px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 17px;
  }
`;

const UploadButton = styled.button`
  width: 123px;
  height: 44px;
  border-radius: 8px;
  padding: 12px 22px;
  background-color: var(--color-primary-500);
  color: white;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-primary-400);
  }

  @media (max-width: 1440px) {
    width: 115px;
    height: 42px;
    font-size: 15px;
    padding: 11px 20px;
  }

  @media (max-width: 768px) {
    width: 110px;
    height: 40px;
    font-size: 14px;
    padding: 10px 18px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 38px;
    font-size: 13px;
    padding: 9px 16px;
    gap: 5px;
  }
`;

const UploadSmallIcon = styled.img`
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E5E5E5;
  margin: 8px 0;

  @media (max-width: 480px) {
    margin: 6px 0;
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

const UploadedDocsTitle = styled.p`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #242331;
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 19px;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const DocRow = styled.div`
  display: flex;
  gap: 24px;
 align-items: ${props => props.$hasError ? 'flex-start' : 'center'};

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

const LabelInputContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
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

const CancelIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 300ms ease-out;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 1440px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`;

const LabelInput = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid ${props => props.$hasError ? '#FF3E3E' : '#ccc'};
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: #242331;
  // background-color: ${props => props.$hasError ? '#FFF0F0' : 'white'};
  background-color: 'white';
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#FF3E3E' : '#043F35'};
    box-shadow: ${props => props.$hasError 
      ? '0 0 0 2px rgba(255, 62, 62, 0.2)' 
      : '0 0 0 2px rgba(4, 63, 53, 0.2)'};
  }

  @media (max-width: 1440px) {
    height: 52px;
    font-size: 15px;
    padding: 7px 14px;
  }

  @media (max-width: 1024px) {
    height: 50px;
    font-size: 14px;
    padding: 6px 12px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 48px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    height: 44px;
    font-size: 13px;
    padding: 6px 10px;
  }

  &::placeholder {
    color: #999;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

const ErrorText = styled.span`
  color: #FF3E3E;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;
