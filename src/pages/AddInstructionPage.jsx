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
    title: 'Add documents that need to be served',
    description: 'Upload each document as a standalone file. Their order will match the sequence shown in the affidavit.'
  },
  {
    component: Step2ServeType,
    title: 'Serve details',
    description: 'Provide information on serve by defining the type and assignee.'
  },
  {
    component: Step3RecipientDetails,
    title: 'Recipient details',
    description: 'Provide all the details relevant to recipient’s information and case details.'
  },
  {
    component: Step4ServiceType,
    title: 'Service type',
    description: 'Please select the type of service you would like to opt for.'
  },
  {
    component: Step5PaymentMethod,
    title: 'Payment method',
    description: 'Please provide payment details.'
  },
  {
    component: Step6Confirmation,
    title: 'Confirmation',
    description: 'Please confirm all the added information is accurate.'
  }
];

const AddInstructionPage = () => {
  const { currentStep, handleNextStep, handlePrevStep, handleStepClick, isStepComplete, isSubmitted, handleInstructionServeSubmit, isLoading } = useInstruction();
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
      handleInstructionServeSubmit={handleInstructionServeSubmit}
      isNextDisabled={!isStepComplete(currentStep)}
      isLoading={isLoading}
    >
      <>
        <StepsList
          currentStep={currentStep}
          isSubmitted={isSubmitted}
          stepsData={stepsData}
          onStepClick={handleStepClick}
          isStepComplete={isStepComplete}
        />
      </>
      <>
        <CurrentStepComponent />
      </>
    </AddInstructionLayout>
  );
};

export default AddInstructionPage;