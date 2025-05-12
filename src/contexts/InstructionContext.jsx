import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useApi } from '../hooks/useApi';

const InstructionContext = createContext();

const initialFormData = {
  documents: [],             //can be pdf,doc,docx,jpg,jpeg,png
  receipt: null,
  documentLabels: {},        // ["Document 1","Document 2"]
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


  // documents: [
  //   {
  //     name: 'witness_statement.pdf',
  //     type: 'application/pdf',
  //     url: 'https://example.com/uploads/witness_statement.pdf',
  //   },
  //   {
  //     name: 'photo_evidence.jpg',
  //     type: 'image/jpeg',
  //     url: 'https://example.com/uploads/photo_evidence.jpg',
  //   },
  // ],
  // receipt: {
  //   name: 'payment_receipt.pdf',
  //   type: 'application/pdf',
  //   url: 'https://example.com/uploads/payment_receipt.pdf',
  // },
  // documentLabels: {
  //   'witness_statement.pdf': 'Witness Statement',
  //   'photo_evidence.jpg': 'Photo Evidence',
  // },

  // // Step 2
  // title: 'Injunction for Breach of Contract',
  // owner: 'Hon. Judge Elizabeth Clarke',
  // document_types: ['Statement', 'Photo Evidence'],
  // reason: 'Breach of contract with urgent relief required.',

  // // Step 3
  // issuing_court: 'Central London County Court',
  // court_case_number: 'CL1234562025',
  // date_of_submission: '2025-05-10',
  // date_of_next_hearing: '2025-06-01',
  // recipient_name: 'Thomas Shelby',
  // recipient_email: 'tshelby@example.co.uk',
  // recipient_address: '10 Garrison Lane, Birmingham, B5 5LP, UK',
  // recipient_phone: '+44 7911 123456',
  // recipient_additional_details: 'Respondent is likely to be unavailable on weekends.',

  // applicant_name: 'Arthur Morgan',
  // applicant_email: 'amorgan@example.co.uk',
  // applicant_address: '22 Baker Street, London, W1U 3BW, UK',
  // applicant_phone: '+44 7555 987654',

  // // Step 4
  // service_type: 'standard',

  // // Step 5 / 6
  // priority: 'medium',
  // deadline: '2025-06-10',
  // type: 'Personal',
  // price: 120.00,
  // instructions: 'Ensure recipient signs acknowledgment form.',
  // document_urls: [
  //   'https://example.com/uploads/witness_statement.pdf',
  //   'https://example.com/uploads/photo_evidence.jpg',
  // ],
  // attempts_allowed: '3',
  // payment_method: 'private',
};

export const InstructionProvider = ({ children }) => {
  const api = useApi();
  const { formatPhoneNumber } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicantPhoneNumber, setApplicantPhoneNumber] = useState('');
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState('');
  const [applicantCursorPosition, setApplicantCursorPosition] = useState(null);
  const [recipientCursorPosition, setRecipientCursorPosition] = useState(null);
  const applicantPhoneInputRef = useRef(null);
  const recipientPhoneInputRef = useRef(null);

  const [currentServeData, setCurrentServeData] = useState(null);
  const [currentInvoiceData, setCurrentInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

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


// >>>>>>>>>>>>>>>>>>> Final Step: Submission
  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
    setApplicantPhoneNumber('');
    setRecipientPhoneNumber('');
    setCurrentServeData(null);
  }, []);

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
    const documentLabels = documents.reduce((acc, doc) => {
      acc[doc.name] = doc.name.split('.')[0]; // Use filename without extension as label
      return acc;
    }, {});

    return {
      documents,
      receipt: null, // Receipt might not be in serve data
      documentLabels,
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
      
      const response = await api.createInstructionServe(formData);

      console.log('Serve created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error submitting serve:', error);
      throw error;
    }
  }, [formData, api]);

  const fetchServeById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      
      const response = await api.getServeById(id);
      const serve = response.serve;
      
      setCurrentServeData(serve);

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
    } catch (error) {
      console.error('Error fetching serve:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, mapServeToFormData, formatPhoneNumber]);

  const fetchInvoiceById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      
      const response = await api.getInvoiceById(id);
      const invoice = response.invoice;
      
      setCurrentInvoiceData(invoice);

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
        currentServeData,
        fetchInvoiceById,
        currentInvoiceData
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