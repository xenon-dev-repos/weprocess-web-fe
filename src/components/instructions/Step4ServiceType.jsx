import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { InstructionsMainContainer } from '../../styles/Shared';
import { useInstruction } from '../../contexts/InstructionContext';
import { Images } from '../../assets/images';
import { ServiceCard } from './ServiceCard';

export const Step4ServiceType = () => {
  const { 
    formData, 
    // setFormData,
    handleInputChange 
  } = useInstruction();

  // const calculateDeadline = (serviceType) => {
  //   const today = new Date();
  //   const deadline = new Date(today);
    
  //   switch(serviceType) {
  //     case 'standard':
  //       deadline.setDate(deadline.getDate() + 10);
  //       break;
  //     case 'urgent':
  //       deadline.setDate(deadline.getDate() + 5);
  //       break;
  //     case 'same-day':
  //     case 'sub-serve':
  //       // current date for same-day and instant delivery
  //       break;
  //     default:
  //       deadline.setDate(deadline.getDate() + 10);
  //   }
    
  //   return deadline.toISOString().split('T')[0]; // YYYY-MM-DD
  // };

  // useEffect(() => {
  //   if (!formData.deadline) {
  //     const initialDeadline = calculateDeadline('standard');
  //     formData.deadline = initialDeadline;
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleServiceSelect = (serviceId) => {
    handleInputChange('service_type', serviceId);

    // const deadline = calculateDeadline(serviceId);
    // setFormData(prev => ({
    //   ...prev,
    //   deadline: deadline
    // }));
  };

  const serviceOptions = [
    {
      id: 'standard',
      title: 'Standard',
      image: Images.instructions.standard,
      description: [
        'Over 10 days period',
        'Delivery within 3 attempts',
        'Documents delivered at doorsteps'
      ],
      price: '£10'
    },
    {
      id: 'urgent',
      title: 'Urgent',
      image: Images.instructions.urgent,
      description: [
        'Over 5 days period',
        'Delivery within 2 attempts',
        'Documents delivered at doorsteps'
      ],
      price: '£200'
    },
    {
      id: 'same-day',
      title: 'Same day',
      image: Images.instructions.sameDay,
      description: [
        'Same day delivery',
        'Delivery within 1 attempt',
        'Documents delivered at doorsteps'
      ],
      price: '£350'
    },
    {
      id: 'sub-serve',
      title: 'Sub Serve',
      image: Images.instructions.subServe,
      description: [
        'Instant Delivery',
        'No 3rd person involved',
        'Secure'
      ],
      price: '£75'
    }
  ];

  return (
    <InstructionsMainContainer>
      <CardsContainer>
        {serviceOptions.map(service => (
          <ServiceCard
            key={service.id}
            title={service.title}
            image={service.image}
            description={service.description}
            price={service.price}
            isSelected={formData.service_type === service.id}
            // onSelect={() => handleInputChange('service_type', service.id)}
            onSelect={() => handleServiceSelect(service.id)}
          />
        ))}
      </CardsContainer>
    </InstructionsMainContainer>
  );
};

 const InstructionsMainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 5px 0;

  @media (max-width: 1440px) {
  
  }

  @media (max-width: 1280px) {
    
  }

  @media (max-width: 1024px) {
  
  }

  @media (max-width: 768px) {
 
  }

  @media (max-width: 480px) {
  
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 1229px;
  padding: 2px 0px 24px 0px;

  @media (max-width: 1280px) {

  }

  @media (max-width: 1024px) {
     justify-content: center;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
