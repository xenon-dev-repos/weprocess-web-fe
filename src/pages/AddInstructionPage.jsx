import React from 'react';
import { AddInstructionLayout } from '../layouts/AddInstructionLayout';
import { StepsList } from '../components/instructions/StepsList';
import { Step1UploadDocuments } from '../components/instructions/Step1UploadDocuments';
import { Step2ServeType } from '../components/instructions/Step2ServeType';
import { Step3RecipientDetails } from '../components/instructions/Step3RecipientDetails';
import { Step4ServiceType } from '../components/instructions/Step4ServiceType';
import { Step5PaymentMethod } from '../components/instructions/Step5PaymentMethod';
import { Step6Confirmation } from '../components/instructions/Step6Confirmation';
import { useInstruction } from '../contexts/InstructionContext';

const stepsData = ['Upload Documents', 'Serve Type', 'Recipient Details', 'Service Type', 'Payment', 'Confirmation']

const stepsConfig = [
  {
    component: Step1UploadDocuments,
    title: 'Upload documents',
    description: 'Upload all the required documents for processing'
  },
  {
    component: Step2ServeType,
    title: 'Serve type',
    description: 'Select the type of service required'
  },
  {
    component: Step3RecipientDetails,
    title: 'Recipient details',
    description: 'Provide all the details relevant to recipient\'s information and case details'
  },
  {
    component: Step4ServiceType,
    title: 'Service type',
    description: 'Select the specific service type and options'
  },
  {
    component: Step5PaymentMethod,
    title: 'Payment method',
    description: 'Choose your preferred payment method'
  },
  {
    component: Step6Confirmation,
    title: 'Confirmation',
    description: 'Review and confirm all the details before submission'
  }
];

const AddInstructionPage = () => {
  const { currentStep, handleNextStep, handlePrevStep, isSubmitted } = useInstruction();
  const CurrentStepComponent = stepsConfig[currentStep - 1].component;

  return (
    <AddInstructionLayout
      isAddInstructionPage={true}
      tabTitle={stepsConfig[currentStep - 1].title}
      tabDescription={stepsConfig[currentStep - 1].description}
      handlePrevStep={handlePrevStep} 
      handleNextStep={handleNextStep}
      currentStep={currentStep}
      stepsConfig={stepsConfig}
      stepsData={stepsData}
      isSubmitted={isSubmitted}
    >
      <>
        <StepsList 
          currentStep={currentStep}
          isSubmitted={isSubmitted}
        />
      </>
      <>
        <CurrentStepComponent />
      </>
    </AddInstructionLayout>
  );
};

export default AddInstructionPage;