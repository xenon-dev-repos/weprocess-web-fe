import React, { useState } from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images';

const AttemptDetails = ({ attempts }) => {
  const [openAttemptId, setOpenAttemptId] = useState(attempts[attempts.length - 1]?.id || null);

  const toggleAttempt = (id) => {
    setOpenAttemptId(prevId => prevId === id ? null : id);
  };

  const formatDateWithOrdinal = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  const getStatusElements = (attempt) => {
    const elements = [];
    
    // Completed/Failed status
    if (attempt.complete_date) {
      elements.push({
        date: `Completed on ${formatDateWithOrdinal(attempt.complete_date)}`,
        title: attempt.is_failed ? 'Job Failed' : 'Job Complete',
        color: attempt.is_failed ? '#FF3E3E' : '#52D060',
        icon: attempt.is_failed ? '✖' : '✓'
      });
    }

    // In transition status
    if (attempt.in_transition_date) {
      elements.push({
        date: `Started on ${formatDateWithOrdinal(attempt.in_transition_date)}`,
        title: 'In transaction',
        // color: '#EDB13E',
        // icon: '🚚'
        color: '#ACACAC',
        icon: ''
      });
    }

    // Start status
    elements.push({
      date: `Got the documents on ${formatDateWithOrdinal(attempt.start_date)}`,
      title: 'Start',
      // color: '#FF7501',
      // icon: '📅'
      color: '#ACACAC',
      icon: ''
    });

    return elements;
  };

  return (
    <AttemptDetailsContainer>
      <AttemptTitle>Attempt details</AttemptTitle>
      
      {attempts.map((attempt) => (
        <AttemptDropdown key={attempt.id} $isOpen={openAttemptId === attempt.id}>
          <AttemptHeader onClick={() => toggleAttempt(attempt.id)}>
            <ArrowIcon 
              src={openAttemptId === attempt.id 
                ? Images.instructions.arrowDown 
                : Images.instructions.arrowRight} 
              alt="Toggle" 
            />
            <AttemptName>Attempt {attempt.attempt_number}</AttemptName>
          </AttemptHeader>
          
          {openAttemptId === attempt.id && (
            <AttemptContent>
              <Divider />
              <TimelineContainer>
                {getStatusElements(attempt).map((element, index) => (
                  <TimelineElement key={index}>
                    <TimelineIcon $color={element.color}>
                      {element.icon}
                    </TimelineIcon>
                    <TimelineContent>
                      <TimelineTitle>{element.title}</TimelineTitle>
                      <TimelineDate>{element.date}</TimelineDate>
                    </TimelineContent>
                    {index !== getStatusElements(attempt).length - 1 && (
                      <TimelineConnector $color={element.color} />
                    )}
                  </TimelineElement>
                ))}
              </TimelineContainer>
            </AttemptContent>
          )}
        </AttemptDropdown>
      ))}
    </AttemptDetailsContainer>
  );
};

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { Images } from '../../assets/images';

// const AttemptDetails = ({ currentInstructionDetails }) => {
//   const attempts = currentInstructionDetails?.serve?.attempts || [];
//   const [openAttemptId, setOpenAttemptId] = useState(attempts[attempts.length - 1]?.id || null);

//   const toggleAttempt = (id) => {
//     setOpenAttemptId(prevId => prevId === id ? null : id);
//   };

//   const getStatusElements = (attempt) => {
//     const elements = [];
    
//     // Completed/Failed status
//     if (attempt.complete_date) {
//       elements.push({
//         date: attempt.complete_date,
//         title: attempt.is_failed ? 'Attempt Failed' : 'Attempt Successful',
//         color: attempt.is_failed ? '#FF3E3E' : '#52D060',
//         icon: attempt.is_failed ? '✖' : '✅'
//       });
//     }

//     // In transition status
//     if (attempt.in_transition_date) {
//       elements.push({
//         date: attempt.in_transition_date,
//         title: 'In Transit',
//         // color: '#EDB13E',
//         // icon: '🚚'
//         color: '#ACACAC',
//         icon: ''
//       });
//     }

//     // Start status
//     elements.push({
//       date: attempt.start_date || 'Not started yet',
//       title: 'Attempt Started',
//       // color: '#FF7501',
//       // icon: '📅'
//       color: '#ACACAC',
//       icon: ''
//     });

//     return elements;
//   };

//   return (
//     <AttemptDetailsContainer>
//       <AttemptTitle>Attempt details</AttemptTitle>
      
//       {attempts.map((attempt) => (
//         <AttemptDropdown key={attempt.id} $isOpen={openAttemptId === attempt.id}>
//           <AttemptHeader onClick={() => toggleAttempt(attempt.id)}>
//             <ArrowIcon 
//               src={openAttemptId === attempt.id 
//                 ? Images.instructions.arrowDown 
//                 : Images.instructions.arrowRight} 
//               alt="Toggle" 
//             />
//             <AttemptName>Attempt {attempt.attempt_number}</AttemptName>
//           </AttemptHeader>
          
//           {openAttemptId === attempt.id && (
//             <AttemptContent>
//               <Divider />
//               <TimelineContainer>
//                 {getStatusElements(attempt).map((element, index) => (
//                   <TimelineElement key={index}>
//                     <TimelineIcon $color={element.color}>
//                       {element.icon}
//                     </TimelineIcon>
//                     <TimelineContent>
//                       <TimelineTitle>{element.title}</TimelineTitle>
//                       <TimelineDate>{element.date}</TimelineDate>
//                     </TimelineContent>
//                     {index !== getStatusElements(attempt).length - 1 && (
//                       <TimelineConnector $color={element.color} />
//                     )}
//                   </TimelineElement>
//                 ))}
//               </TimelineContainer>
//             </AttemptContent>
//           )}
//         </AttemptDropdown>
//       ))}
//     </AttemptDetailsContainer>
//   );
// };

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 24px;
`;

const TimelineElement = styled.div`
  display: flex;
  position: relative;
  gap: 12px;
`;

const TimelineIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -12px;
  z-index: 2;
`;

const TimelineContent = styled.div`
  margin-left: 24px;
  padding-bottom: 16px;
`;

const TimelineTitle = styled.h4`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #121F24;
`;

const TimelineDate = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #656565;
`;

const TimelineConnector = styled.div`
  position: absolute;
  left: 0;
  top: 24px;
  height: calc(100% + 16px);
  width: 2px;
  background: ${props => props.$color};
  opacity: 0.3;
  z-index: 1;
`;

const AttemptDetailsContainer = styled.div`
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  padding: 24px;
  gap: 16px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;

  .custom-timeline {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;

    &:before {
      background: #E5E5E5;
      left: 24px !important;
    }

    .vertical-timeline-element {
      margin: 0 0 16px 0 !important;
      padding: 0 !important;

      &:last-child {
        margin-bottom: 0 !important;
      }
    }

    .vertical-timeline-element-content {
      padding: 12px 12px 12px 48px !important;
      box-shadow: none !important;
    }

    .timeline-date {
      color: #656565;
      font-family: 'Manrope', sans-serif;
      font-size: 12px !important;
      font-weight: 400;
      padding-left: 8px;
    }
  }
`;

const AttemptTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  margin-bottom: 16px;
`;

const AttemptDropdown = styled.div`
  width: 100%;
  border-radius: 12px;
  background: #F5F5F5;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 8px;
`;

const AttemptHeader = styled.div`
  height: 58px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const AttemptName = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #121F24;
`;

const AttemptContent = styled.div`
  padding: 16px;
`;

const Divider = styled.div`
  height: 1px;
  background: #E5E5E5;
  margin: 0 16px 16px;
`;

export default AttemptDetails;
