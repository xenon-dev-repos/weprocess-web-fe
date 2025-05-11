import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const InstructionContext = createContext();

export const InstructionProvider = ({ children }) => {
  const { formatPhoneNumber } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicantPhoneNumber, setApplicantPhoneNumber] = useState('');
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState('');
  const [applicantCursorPosition, setApplicantCursorPosition] = useState(null);
  const [recipientCursorPosition, setRecipientCursorPosition] = useState(null);
  const applicantPhoneInputRef = useRef(null);
  const recipientPhoneInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // fields for Step 1
    documents: [],
    receipt: null,
    documentLabels: {},

    // fields for Step 2
    caseName: '',
    owner: '',
    document_types: [],
    reason: null,
    
    // fields for Step 3
    issuing_court: '',
    court_case_number: '',
    date_of_submission: '',
    date_of_next_hearing: '',
    recipient_name: '',
    recipient_email: '',
    recipient_address: '',
    recipient_phone: '',
    applicant_name: '',
    applicant_email: '',
    applicant_address: '',
    applicant_phone: '',

    // fields for Step 4
    service_type: 'standard',

    // fields for step 5 / 6
    priority: 'low',
    deadline: '',
    type: 'Personal',
    price: 0,
    instructions: null,
    document_urls: [],
    attempts_allowed: '3',
    payment_method: 'private',
  });

// >>>>>>>>>>>>>>>>>>> STEP 1 Functions
  const handleDocumentUpload = useCallback((files) => {
    const newDocuments = Array.from(files)
      .filter(file => file.type === 'application/pdf' && file.size <= 23 * 1024 * 1024)
      .map(file => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: 'document'
      }));

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  }, []);

  const handleReceiptUpload = useCallback((file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setFormData(prev => ({
        ...prev,
        receipt: {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: 'receipt'
        }
      }));
    }
  }, []);

  const removeDocument = useCallback((id) => {
    setFormData(prev => {
      const updatedDocuments = prev.documents.filter(doc => doc.id !== id);
      const updatedLabels = { ...prev.documentLabels };
      delete updatedLabels[id];
      
      return {
        ...prev,
        documents: updatedDocuments,
        documentLabels: updatedLabels
      };
    });
  }, []);

  const handleLabelChange = useCallback((id, label) => {
    setFormData(prev => ({
      ...prev,
      documentLabels: {
        ...prev.documentLabels,
        [id]: label
      }
    }));
  }, []);


// >>>>>>>>>>>>>>>>>>> STEP 2 Functions
//   useEffect(() => {
//     if (cursorPosition !== null && phoneInputRef.current) {
//       phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
//       setCursorPosition(null);
//     }
//   }, [phoneNumber, cursorPosition]);

//  const handleInputChange = useCallback((name, value, selectionStart) => {
//     // const { name, value, selectionStart } = e.target;

//     if (name === 'recipient_phone') {
//         const formattedValue = formatPhoneNumber(value, phoneNumber);
//         const cursorOffset = formattedValue.length - value.length;
//         const newCursorPosition = selectionStart + cursorOffset;
        
//         setPhoneNumber(formattedValue);
//         setCursorPosition(newCursorPosition);
  
//         setFormData(prev => ({
//           ...prev,
//           recipient_phone: formattedValue.replace(/\s/g, '')
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//   }, [formatPhoneNumber, phoneNumber]);

useEffect(() => {
    if (applicantCursorPosition !== null && applicantPhoneInputRef.current) {
      applicantPhoneInputRef.current.setSelectionRange(applicantCursorPosition, applicantCursorPosition);
      setApplicantCursorPosition(null);
    }
  }, [applicantPhoneNumber, applicantCursorPosition]);

  useEffect(() => {
    if (recipientCursorPosition !== null && recipientPhoneInputRef.current) {
      recipientPhoneInputRef.current.setSelectionRange(recipientCursorPosition, recipientCursorPosition);
      setRecipientCursorPosition(null);
    }
  }, [recipientPhoneNumber, recipientCursorPosition]);

  const handleInputChange = useCallback((eOrName, valueOrEvent, selectionStart) => {
    let name, value, selectionStartValue;
    
    if (typeof eOrName === 'object' && eOrName.target) {
      const e = eOrName;
      name = e.target.name;
      value = e.target.value;
      selectionStartValue = e.target.selectionStart;
    } else {
      name = eOrName;
      value = valueOrEvent;
      selectionStartValue = selectionStart;
    }

    if (name === 'recipient_phone') {
      const formattedValue = formatPhoneNumber(value, recipientPhoneNumber);
      const cursorOffset = formattedValue.length - value.length;
      const newCursorPosition = (selectionStartValue || 0) + cursorOffset;
      
      setRecipientPhoneNumber(formattedValue);
      setRecipientCursorPosition(newCursorPosition);

      setFormData(prev => ({
        ...prev,
        recipient_phone: formattedValue.replace(/\s/g, '')
      }));
    } 
    else if (name === 'applicant_phone') {
      const formattedValue = formatPhoneNumber(value, applicantPhoneNumber);
      const cursorOffset = formattedValue.length - value.length;
      const newCursorPosition = (selectionStartValue || 0) + cursorOffset;
      
      setApplicantPhoneNumber(formattedValue);
      setApplicantCursorPosition(newCursorPosition);

      setFormData(prev => ({
        ...prev,
        applicant_phone: formattedValue.replace(/\s/g, '')
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [formatPhoneNumber, applicantPhoneNumber, recipientPhoneNumber]);

  const handleDocTypeSelect = useCallback((type) => {
    setFormData(prev => {
        const wasSelected = prev.document_types.includes(type);

        if (type === 'Other (Please Specify)') {
            return {
              ...prev,
              document_types: wasSelected
                ? prev.document_types.filter(t => t !== type) // Remove if already selected
                : [...prev.document_types, type], // Add if not selected
              reason: wasSelected ? '' : prev.reason // Clear reason if unselecting
            };
        }

        // For regular types
        const new_document_types = wasSelected
        ? prev.document_types.filter(t => t !== type)
        : [...prev.document_types, type];

        return {
        ...prev,
        document_types: new_document_types
        };
    });
  }, []);

  const handleReasonChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      reason: value
    }));
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Currently false but it will be true when submitted.
      setIsSubmitted(false);
      // Here you would typically submit the formData to your API
      console.log('Form submitted:', formData);
    }
  }, [currentStep, formData]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsSubmitted(false);
    }
  }, [currentStep]);


// >>>>>>>>>>>>>>>>>>> STEP 3 Functions
const handleDateChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleDateInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <InstructionContext.Provider
      value={{
        formData,

        currentStep,
        setCurrentStep,
        isSubmitted,
        setIsSubmitted,

        handleDocumentUpload,
        handleReceiptUpload,
        removeDocument,
        handleLabelChange,
        handleNextStep,
        handlePrevStep,

        handleDocTypeSelect,
        handleReasonChange,
        handleInputChange,

        handleDateChange,
        handleDateInputChange,
        applicantPhoneNumber,
        recipientPhoneNumber,
        applicantPhoneInputRef,
        recipientPhoneInputRef,
      }}
    >
      {children}
    </InstructionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInstruction = () => {
  const context = useContext(InstructionContext);
  if (!context) {
    throw new Error('useInstruction must be used within an InstructionProvider');
  }
  return context;
};