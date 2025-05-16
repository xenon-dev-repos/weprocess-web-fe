import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { ProgressBar } from '../instructions/ProgressBar';

export const PageHeader = ({ title, filterButtons, onFilterChange, isAddInstruction = false, stepsData, currentStep }) => {
  const [activeFilter, setActiveFilter] = useState(filterButtons && filterButtons[0]?.id);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  return (
    <>
      {isAddInstruction ? (
        <PageHeaderContainerInstructions>
            <ContentContainer>
                <HeaderTitle>{title}</HeaderTitle>
                <CompletedOverTotalDiv>
                  {currentStep}/{stepsData.length}
                </CompletedOverTotalDiv>
            </ContentContainer>
            <ProgressBar steps={stepsData} currentStep={currentStep}/>
        </PageHeaderContainerInstructions>
      ) : (
        <PageHeaderContainer>
          <HeaderTitle>{title}</HeaderTitle>
          <FilterButtonsContainer>
            {filterButtons && filterButtons.map((button) => (
              <FilterButton
                key={button.id}
                onClick={() => handleFilterClick(button.id)}
                $active={activeFilter === button.id}
                $dotColor={button.dotColor}
              >
                <StatusDot $dotColor={button.dotColor} />
                {button.label}
              </FilterButton>
            ))}
          </FilterButtonsContainer>
        </PageHeaderContainer>
      )}
    </>
  );
};

const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (max-width: 1280px) {
    gap: 8px;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

export const HeaderTitle = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 60px;
  letter-spacing: 0%;
  color: ${({ theme }) => theme.color.WhiteText};
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 28px;
    line-height: 50px;
  }

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 32px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

const FilterButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1280px) {
    gap: 12px;
  }

  @media (max-width: 1024px) {
    gap: 10px;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0%;
  color: ${({ $active }) => $active ? '#043F35' : '#E5E5E5'};
  background-color: ${({ $active }) => $active ? '#FFFFFF' : 'transparent'};
  border: none;
  cursor: pointer;
  padding: 16px;
  border-radius: 16px;
  box-shadow: ${({ $active }) => $active ? '0px 2px 8px 0px #00000026' : 'none'};
  width: 165px;
  height: 52px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $active }) => !$active && '#FFFFFF1A'};
  }

  @media (max-width: 1440px) {
    width: 150px;
    height: 48px;
    padding: 14px;
    font-size: 15px;
  }

  @media (max-width: 1280px) {
    width: 140px;
    height: 44px;
    padding: 12px;
  }

  @media (max-width: 1024px) {
    width: auto;
    min-width: 120px;
    height: 40px;
    padding: 10px 16px;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    min-width: 100px;
    height: 36px;
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    min-width: 80px;
    height: 32px;
    padding: 6px 10px;
    font-size: 12px;
    gap: 6px;
    border-radius: 12px;
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $dotColor, theme }) => theme.color[$dotColor] || $dotColor};

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }

  @media (max-width: 480px) {
    width: 5px;
    height: 5px;
  }
`;


const PageHeaderContainerInstructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: -25px;

  @media (max-width: 1280px) {
    gap: 8px;
  }

  @media (max-width: 1024px) {
    gap: 8px;
    margin-bottom: -18px;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  width: 100%;

  @media (max-width: 1280px) {
    gap: 8px;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;


const CompletedOverTotalDiv = styled.div`
  display: flex;
  align-self: flex-end;
  margin-bottom: 5px;
  flex-wrap: nowrap;

  @media (max-width: 1280px) {
    gap: 12px;
  }

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;