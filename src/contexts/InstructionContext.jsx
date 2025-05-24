/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useApi } from '../hooks/useApi';
import { useNavigation } from '../hooks/useNavigation';
import { Images } from '../assets/images';

const InstructionContext = createContext();

export const InstructionProvider = ({ children }) => {
  const api = useApi();
  const navigation = useNavigation();
  const { formatPhoneNumber, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicantPhoneNumber, setApplicantPhoneNumber] = useState('');
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState('');
  const [applicantCursorPosition, setApplicantCursorPosition] = useState(null);
  const [recipientCursorPosition, setRecipientCursorPosition] = useState(null);
  const applicantPhoneInputRef = useRef(null);
  const recipientPhoneInputRef = useRef(null);
  const [currentInstructionDetails, setCurrentInstructionDetails] = useState(null);
  const [currentInvoiceDetails, setCurrentInvoiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    documents: [],             //can be pdf,doc,docx,jpg,jpeg,png
    receipt: null,
    document_labels: [],        // ["Document 1","Document 2"]
    document_urls: [],
    title: '',
    owner: '',
    document_types: [],        // Comma separated string input, saved as array, 
    reason: null,
    issuing_court: '',
    court_case_number: '',
    date_of_submission: '',
    date_of_next_hearing: '',
    recipient_name: '',
    recipient_email: '',
    recipient_address: '',
    recipient_phone: '',
    recipient_additional_details: '',
    applicant_name: '',
    applicant_email: '',
    applicant_address: '',
    applicant_phone: '',
    service_type: 'standard',  // ['standard','urgent','same_day','sub_serve']
    priority: 'low',           // ["low", "medium", "high", "urgent"]
    deadline: '',
    type: 'Personal',
    price: 0,
    instructions: null,
    attempts_allowed: '3',
    payment_method: 'private',

    // documents: [],
    // receipt: '',
    // document_labels: [],
    // document_urls: [],
    // title: 'Service of Summons to Defendant',
    // owner: 'John Doe',
    // document_types: ['Divorce Petition', 'Statutory Demand'],
    // reason: 'To initiate legal proceedings against the defendant.',
    // issuing_court: 'Superior Court of California, County of Los Angeles',
    // court_case_number: 'LA12345678',
    // date_of_submission: '2030-01-15',
    // date_of_next_hearing: '2030-02-15',
    // recipient_name: 'Jane Smith',
    // recipient_email: 'jane.smith@example.com',
    // recipient_address: '1234 Elm Street, Los Angeles, CA 90001',
    // recipient_phone: '3105557890',
    // recipient_additional_details: 'Lives in unit #5B. Best time to serve is after 6 PM.',
    // applicant_name: 'John Doe',
    // applicant_email: 'john.doe@example.com',
    // applicant_address: '5678 Oak Avenue, Pasadena, CA 91101',
    // applicant_phone: '6265551234',
    // service_type: 'standard',
    // priority: 'low',
    // deadline: '2030-01-20',
    // type: 'Personal',
    // price: 150.00,
    // instructions: 'Serve at doorstep and take a photo as proof of delivery.',
    // attempts_allowed: '3',
    // payment_method: 'private'
  };

  const [formData, setFormData] = useState(initialFormData);

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
    setApplicantPhoneNumber('');
    setRecipientPhoneNumber('');
    setCurrentInstructionDetails(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepValidations = {
  1: (formData) => {
    // Step 1: Must have at least one document and all documents labeled
    const hasDocuments = formData.documents.length > 0;
    const allLabeled = formData.documents.every(doc => 
      formData.document_labels[doc.id]?.trim()
    );
    const noLabelErrors = !Object.values(formData.labelErrors || {}).some(Boolean);
    return hasDocuments && allLabeled && noLabelErrors;
  },
  2: (formData) => {
  // Step 2: Must have title, owner, and at least one document type
  const hasOtherDocumentType = formData.document_types.includes('Other (Please Specify)');
  const hasValidDocumentTypes = formData.document_types.some(
    type => type !== 'Other (Please Specify)'
  );

  // If 'Other' is selected, we must have a reason
  const hasValidReason = !hasOtherDocumentType || 
    (hasOtherDocumentType && formData.reason && formData.reason.trim() !== '');

  return (
    formData.title.trim() !== '' && 
    formData.owner.trim() !== '' && 
    (hasValidDocumentTypes || hasOtherDocumentType) && 
    hasValidReason
  );
},
  3: (formData) => {
    // Step 3: All recipient and applicant fields required
    return formData.applicant_name?.trim() !== '' &&
           formData.applicant_phone?.trim() !== '' &&
           formData.applicant_address?.trim() !== '' &&
           formData.recipient_name?.trim() !== '' &&
           formData.recipient_phone?.trim() !== '' &&
           formData.recipient_address?.trim() !== '' &&
           formData.issuing_court?.trim() !== '' &&
           formData.court_case_number?.trim() !== '' &&
           formData.date_of_submission?.trim() !== '' &&
           formData.date_of_next_hearing?.trim() !== '';
  },
  4: (formData) => {
    // Step 4: Service type must be selected
    return formData.service_type.trim() !== '';
  },
  5: (formData, user) => {
    // Step 5: Payment method must be selected
    // For firms, check payment_type; for individuals, check payment_method
    if (user?.type === "firm") {
      return formData.payment_type?.trim() !== '';
    }
    return formData.payment_method?.trim() !== '';
  },
    6: (formData, user) => {
    // For confirmation step, check if all previous steps are complete
    return [1, 2, 3, 4, 5].every(step => 
      stepValidations[step](formData, user)
    );
  }
  };

  const validateStep3Details = (formData) => {
    const isPhoneValid = (phone) => phone?.replace(/\D/g, '').length >= 10;
    const isEmailValid = (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
      isPhoneValid(formData.applicant_phone) &&
      isPhoneValid(formData.recipient_phone) &&
      isEmailValid(formData.applicant_email) &&
      isEmailValid(formData.recipient_email)
    );
  };

  const isStepComplete = useCallback((step) => {
    const validator = stepValidations[step];
    return validator ? validator(formData, user) : false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, user]);

  const mapServeToFormData = useCallback((serveData) => {
      if (!serveData) return;
      
    const documents = serveData.document_urls?.map(url => ({
      name: url.split('/').pop(),
      type: url.endsWith('.pdf') ? 'application/pdf' : 
            url.match(/\.(jpg|jpeg|png)$/i) ? 'image/' + url.split('.').pop().toLowerCase() : 
            'application/octet-stream',
      url: url
    })) || [];

    // Create document labels
    const document_labels = documents.reduce((acc, doc) => {
      acc[doc.name] = doc.name.split('.')[0]; // Use filename without extension as label
      return acc;
    }, {});

    return {
      documents,
      receipt: null, // Receipt might not be in serve data
      document_labels,
      document_urls: serveData.document_urls || [],
      title: serveData.title || '',
      owner: serveData.owner || '',
      document_types: serveData.document_types || [],
      reason: serveData.reason || null,
      issuing_court: serveData.issuing_court || '',
      court_case_number: serveData.court_case_number || '',
      date_of_submission: serveData.date_of_submission || '',
      date_of_next_hearing: serveData.date_of_next_hearing || '',
      recipient_name: serveData.recipient_name || '',
      recipient_email: serveData.recipient_email || '',
      recipient_address: serveData.recipient_address || '',
      recipient_phone: serveData.recipient_phone || '',
      recipient_additional_details: serveData.recipient_additional_details || '',
      applicant_name: serveData.applicant_name || '',
      applicant_email: serveData.applicant_email || '',
      applicant_address: serveData.applicant_address || '',
      applicant_phone: serveData.applicant_phone || '',
      service_type: serveData.service_type || 'standard',
      priority: serveData.priority || 'low',
      deadline: serveData.deadline || '',
      type: serveData.type || 'Personal',
      price: serveData.price || 0,
      instructions: serveData.instructions || null,
      attempts_allowed: serveData.attempts_allowed?.toString() || '3',
      payment_method: 'private', // Default as it might not be in serve data
    };
  }, []);

  const handleInstructionServeSubmit = useCallback(async () => {
    try {
      setIsSubmitted(true);
      setIsLoading(true);
      
      const formDataToSend = new FormData();

      // Filter out 'Other (Please Specify)' from document_types
      const filteredDocumentTypes = formData.document_types?.filter(
        type => type !== 'Other (Please Specify)'
      );

      // Append all non-file fields
      const fieldsToAppend = {
        title: formData.title,
        owner: formData.owner,
        document_types: filteredDocumentTypes?.join(','),
        reason: formData.reason,
        issuing_court: formData.issuing_court,
        court_case_number: formData.court_case_number,
        date_of_submission: DateToDDMMYYYY(formData.date_of_submission),
        date_of_next_hearing: DateToDDMMYYYY(formData.date_of_next_hearing),
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        recipient_address: formData.recipient_address,
        recipient_phone: formData.recipient_phone,
        recipient_additional_details: formData.recipient_additional_details,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_address: formData.applicant_address,
        applicant_phone: formData.applicant_phone,
        service_type: formData.service_type,
        priority: formData.priority,
        // deadline: DateToDDMMYYYY(formData.deadline),
        type: formData.type,
        price: formData.price.toString(), // Ensure number is string
        instructions: formData.instructions,
        attempts_allowed: formData.attempts_allowed,
        payment_method: formData.payment_method
      };

      // Append all simple fields
      Object.entries(fieldsToAppend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Handle document labels - ensure it's always an array
      const docLabels = Array.isArray(formData.document_labels) 
        ? formData.document_labels 
        : Object.values(formData.document_labels || {});
      formDataToSend.append('document_labels', JSON.stringify(docLabels));

      // Handle documents - both files and URLs
      formData.documents?.forEach((doc, index) => {
        if (doc.file instanceof File || doc.file instanceof Blob) {
          formDataToSend.append(`documents[${index}]`, doc.file, doc.name || `document_${index}`);
        } else if (doc.url) {
          formDataToSend.append(`document_urls[${index}]`, doc.url);
        }
      });

      // Handle receipt
      if (formData.receipt?.file instanceof Blob) {
        formDataToSend.append('receipt', formData.receipt.file, formData.receipt.name || 'receipt');
      }

      // Make API call (ensure your API sets proper content-type for FormData)
      const response = await api.createInstructionServe(formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigation.navigateToInstructions();
      resetFormData()
      return response;
      
    } catch (error) {
      setIsSubmitted(false);
      console.error('Error submitting serve:', error);
      throw error;
    } finally {
      setIsLoading(false)
      // setIsSubmitted(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, api]);

  const arePreviousStepsComplete = useCallback((step) => {
    for (let i = 1; i < step; i++) {
      if (!isStepComplete(i)) return false;
    }
    return true;
  }, [isStepComplete]);

  const handleNextStep = useCallback(() => {
    if (!isStepComplete(currentStep)) return;

    // For step 3, perform additional validation
    if (currentStep === 3 && !validateStep3Details(formData)) {
      document.querySelector('#step3-form')?.reportValidity();
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitted(true);
      handleInstructionServeSubmit();
    }
  }, [currentStep, formData, isStepComplete, handleInstructionServeSubmit]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsSubmitted(false);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepNumber) => {
    // Always allow going backward
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }

    // For forward navigation:
    // 1. Check if all previous steps are complete
    // 2. Check if the target step is complete (if jumping ahead)
    if (arePreviousStepsComplete(stepNumber) && 
        (stepNumber === currentStep + 1 || isStepComplete(stepNumber))) {
      setCurrentStep(stepNumber);
    }
  }, [currentStep, isStepComplete, arePreviousStepsComplete]);

  const DateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    
    // Handle ISO format (YYYY-MM-DD)
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }
    
    // Handle MM/DD/YYYY format
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split("/");
      return `${day}/${month}/${year}`;
    }
    
    return dateStr; // Fallback for other formats
  };

// >>>>>>>>>>>>>>>>>>> STEP 1 Functions
  const handleDocumentUpload = useCallback((files) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    const newDocuments = Array.from(files)
      .filter(file => validTypes.includes(file.type) && file.size <= 23 * 1024 * 1024)
      .map(file => {
        // Get the file extension from the name
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: fileExt // Store the file extension instead of MIME type
        };
      });

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  }, []);

  const handleReceiptUpload = useCallback((file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setFormData(prev => ({
        ...prev,
        receipt: {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          file: file,  // Make sure this is the actual File object
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: 'receipt',
          url: URL.createObjectURL(file)  // Create and store the URL here
        }
      }));
    }
  }, []);

  useEffect(() => {
  return () => {
    // Clean up object URLs when component unmounts
    if (formData.receipt?.url) {
      URL.revokeObjectURL(formData.receipt.url);
    }
  };
}, [formData.receipt]);

  const removeDocument = useCallback((id) => {
    setFormData(prev => {
      const updatedDocuments = prev.documents.filter(doc => doc.id !== id);
      const updatedLabels = { ...prev.document_labels };
      delete updatedLabels[id];
      
      return {
        ...prev,
        documents: updatedDocuments,
        document_labels: updatedLabels
      };
    });
  }, []);

  const handleLabelChange = useCallback((docId, value) => {
    setFormData(prev => {
      // Create a copy of current document_labels
      const newLabels = { ...prev.document_labels };
      
      // Update only the label for this specific document
      newLabels[docId] = value;
      
      // Check for duplicates
      const labels = Object.values(newLabels);
      const duplicateIndex = labels.findIndex((label, idx) => 
        label === value && Object.keys(newLabels)[idx] !== docId
      );
      
      const isValid = duplicateIndex === -1;
      
      return {
        ...prev,
        document_labels: newLabels,
        labelErrors: {
          ...prev.labelErrors,
          [docId]: isValid ? null : 'Document labels must be unique'
        }
      };
    });
  }, []);

// >>>>>>>>>>>>>>>>>>> STEP 2 Functions
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

      let phoneValue = formattedValue.replace(/\s/g, '');
      if (!phoneValue.startsWith('+44') && !phoneValue.startsWith('44')) {
        phoneValue = '+44' + phoneValue.replace(/^0/, ''); // Remove leading 0 if present
      }

      setFormData(prev => ({
        ...prev,
        recipient_phone: phoneValue
      }));
    } 
    else if (name === 'applicant_phone') {
      const formattedValue = formatPhoneNumber(value, applicantPhoneNumber);
      const cursorOffset = formattedValue.length - value.length;
      const newCursorPosition = (selectionStartValue || 0) + cursorOffset;
      
      setApplicantPhoneNumber(formattedValue);
      setApplicantCursorPosition(newCursorPosition);

      let phoneValue = formattedValue.replace(/\s/g, '');
      if (!phoneValue.startsWith('+44') && !phoneValue.startsWith('44')) {
        phoneValue = '+44' + phoneValue.replace(/^0/, ''); // Remove leading 0 if present
      }

      setFormData(prev => ({
        ...prev,
        applicant_phone: phoneValue
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

        // if (type === 'Other (Please Specify)') {
        //     return {
        //       ...prev,
        //       document_types: wasSelected
        //         ? prev.document_types.filter(t => t !== type) // Remove if already selected
        //         : [...prev.document_types, type], // Add if not selected
        //       reason: wasSelected ? '' : prev.reason // Clear reason if unselecting
        //     };
        // }

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

  // TODO: Add serve id in page route.
  const fetchServeById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      
      const response = await api.getServeById(id);
      const serve = response.serve;
      
      if (serve) {
          setCurrentInstructionDetails(serve);
                const mappedFormData = mapServeToFormData(serve);
      setFormData(mappedFormData);

      if (serve.recipient_phone) {
        const formattedRecipientPhone = formatPhoneNumber(serve.recipient_phone, '');
        setRecipientPhoneNumber(formattedRecipientPhone);
      }
      
      if (serve.applicant_phone) {
        const formattedApplicantPhone = formatPhoneNumber(serve.applicant_phone, '');
        setApplicantPhoneNumber(formattedApplicantPhone);
      }
        
      return serve;

      } else {
          setCurrentInstructionDetails(null);
      }

    } catch (error) {
      console.error('Error fetching serve:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, mapServeToFormData, formatPhoneNumber]);

  // TODO: Add invoice id in page route.
  const fetchInvoiceById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      
      const response = await api.getInvoiceById(id);
      const invoice = response.invoice;
      
      setCurrentInvoiceDetails(invoice);

      const mappedFormData = mapServeToFormData(invoice.serve);
      setFormData(mappedFormData);

      if (invoice.serve.recipient_phone) {
        const formattedRecipientPhone = formatPhoneNumber(invoice.serve.recipient_phone, '');
        setRecipientPhoneNumber(formattedRecipientPhone);
      }
      
      if (invoice.serve.applicant_phone) {
        const formattedApplicantPhone = formatPhoneNumber(invoice.serve.applicant_phone, '');
        setApplicantPhoneNumber(formattedApplicantPhone);
      }
        
      return invoice;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, mapServeToFormData, formatPhoneNumber]);

  return (
    <InstructionContext.Provider
      value={{
        formData,
        setFormData,
        initialFormData,
        isLoading,

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
        handleStepClick,

        handleDocTypeSelect,
        handleReasonChange,
        handleInputChange,

        handleDateChange,
        handleDateInputChange,
        applicantPhoneNumber,
        recipientPhoneNumber,
        applicantPhoneInputRef,
        recipientPhoneInputRef,

        resetFormData,
        handleInstructionServeSubmit,
        fetchServeById,
        currentInstructionDetails,
        fetchInvoiceById,
        currentInvoiceDetails,

        isStepComplete,
        stepValidations,
      }}
    >
      {children}
    </InstructionContext.Provider>
  );
};

export const useInstruction = () => {
  const context = useContext(InstructionContext);

  if (!context) {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }

    // TODO: I can also through error Message, I can also show error page if I do not reload the page automatically on above LineController.
    // throw new Error('Instruction context is missing. Reloading page...');
  }

  return context;
};
