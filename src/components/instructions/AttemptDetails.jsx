// components/shared/AttemptDetails.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Images } from '../../assets/images';

  const AttemptDetails = () => {

    const attempts = [
        {
            id: 2,
            title: 'Attempt 1',
            statuses: [
              {
                title: 'Job Failed',
                date: 'Failed on 20th March, 2024',
                color: '#FF3E3E'
              },
              {
                title: 'In transaction',
                date: 'Started on 19th March, 2024',
                color: '#EDB13E'
              },
              {
                title: 'Start',
                date: 'Got the documents on 18th March 2024',
                color: '#FF7501'
              }
            ]
          },
    {
      id: 1,
      title: 'Attempt 2',
      statuses: [
        {
          title: 'Job Complete',
          date: 'Completed on 24th March, 2024',
          color: '#52D060'
        },
        {
          title: 'In transaction',
          date: 'Started on 23rd March, 2024',
          color: '#EDB13E'
        },
        {
          title: 'Start',
          date: 'Got the documents on 22nd March 2024',
          color: '#FF7501'
        }
      ]
    },

  ];
    const [openAttemptId, setOpenAttemptId] = useState(attempts[attempts.length - 1]?.id || null);
  
    const toggleAttempt = (id) => {
      setOpenAttemptId(prevId => prevId === id ? null : id);
    };
  
    return (
      <AttemptDetailsContainer>
        <AttemptTitle>Attempt details</AttemptTitle>
        
        {attempts.map((attempt) => (
          <AttemptDropdown 
            key={attempt.id} 
            $isOpen={openAttemptId === attempt.id}
          >
            <AttemptHeader onClick={() => toggleAttempt(attempt.id)}>
              <ArrowIcon 
                src={openAttemptId === attempt.id 
                  ? Images.instructions.arrowDown 
                  : Images.instructions.arrowRight} 
                alt="Toggle" 
              />
              <AttemptName>{attempt.title}</AttemptName>
            </AttemptHeader>
            
            {openAttemptId === attempt.id && (
              <AttemptContent>
                <Divider />
                <StatusTimeline>
                  {attempt.statuses.map((status, index) => (
                    <StatusItem key={index}>
                      <StatusIndicator>
                        <StatusCircle $color={status.color} />
                        {index !== attempt.statuses.length - 1 && (
                          <StatusLine $color={status.color} />
                        )}
                      </StatusIndicator>
                      <StatusText>
                        <StatusTitle>{status.title}</StatusTitle>
                        <StatusDate>{status.date}</StatusDate>
                      </StatusText>
                    </StatusItem>
                  ))}
                </StatusTimeline>
              </AttemptContent>
            )}
          </AttemptDropdown>
        ))}
      </AttemptDetailsContainer>
    );
  };

// const AttemptDetails = () => {
//     const [openAttemptId, setOpenAttemptId] = useState(null);

//     const toggleAttempt = (id) => {
//       setOpenAttemptId(prevId => prevId === id ? null : id);
//     };

//   const attempts = [
//     {
//       id: 1,
//       title: 'Attempt 2',
//       statuses: [
//         {
//           title: 'Job Complete',
//           date: 'Completed on 24th March, 2024',
//           color: '#52D060'
//         },
//         {
//           title: 'In transaction',
//           date: 'Started on 23rd March, 2024',
//           color: '#EDB13E'
//         },
//         {
//           title: 'Start',
//           date: 'Got the documents on 22nd March 2024',
//           color: '#FF7501'
//         }
//       ]
//     },
//     {
//       id: 2,
//       title: 'Attempt 1',
//       statuses: [
//         {
//           title: 'Job Failed',
//           date: 'Failed on 20th March, 2024',
//           color: '#FF3E3E'
//         },
//         {
//           title: 'In transaction',
//           date: 'Started on 19th March, 2024',
//           color: '#EDB13E'
//         },
//         {
//           title: 'Start',
//           date: 'Got the documents on 18th March 2024',
//           color: '#FF7501'
//         }
//       ]
//     }
//   ];

//   return (
//     <AttemptDetailsContainer>
//       <AttemptTitle>Attempt details</AttemptTitle>
      
//       {attempts.map((attempt) => (
//         <AttemptDropdown 
//           key={attempt.id} 
//           $isOpen={openAttemptId === attempt.id}
//         >
//           <AttemptHeader onClick={() => toggleAttempt(attempt.id)}>
//             <ArrowIcon 
//               src={openAttemptId === attempt.id 
//                 ? Images.instructions.arrowDown
//                 : Images.instructions.arrowRight} 
//               alt="Toggle" 
//             />
//             <AttemptName>{attempt.title}</AttemptName>
//           </AttemptHeader>
          
//           {openAttemptId === attempt.id && (
//             <AttemptContent>
//               <Divider />
//               <StatusTimeline>
//                 {attempt.statuses.map((status, index) => (
//                   <StatusItem key={index}>
//                     <StatusIndicator>
//                       <StatusCircle $color={status.color} />
//                       {index !== attempt.statuses.length - 1 && (
//                         <StatusLine color={status.color} />
//                       )}
//                     </StatusIndicator>
//                     <StatusText>
//                       <StatusTitle>{status.title}</StatusTitle>
//                       <StatusDate>{status.date}</StatusDate>
//                     </StatusText>
//                   </StatusItem>
//                 ))}
//               </StatusTimeline>
//             </AttemptContent>
//           )}
//         </AttemptDropdown>
//       ))}
//     </AttemptDetailsContainer>
//   );
// };

const AttemptDetailsContainer = styled.div`
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  padding: 24px;
  gap: 16px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
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

const StatusTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 8px;
`;

const StatusItem = styled.div`
  display: flex;
  gap: 12px;
  position: relative;
`;

const StatusIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  position: relative;
`;

const StatusCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100px;
  background: ${props => props.$color};
  position: relative;
  z-index: 2;
`;

const StatusLine = styled.div`
  width: 2px;
  height: 40px;
  background: ${props => props.color || '#E5E5E5'};
  opacity: 0.3;
  position: absolute;
  top: 16px;
  left: 7px;
  z-index: 1;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatusTitle = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #121F24;
`;

const StatusDate = styled.span`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #656565;
`;

export default AttemptDetails;