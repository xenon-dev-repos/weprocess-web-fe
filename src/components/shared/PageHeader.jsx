import { useState } from 'react';
import styled from 'styled-components';

export const PageHeader = ({ title, filterButtons, onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState(filterButtons[0]?.id);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <PageHeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
      <FilterButtonsContainer>
        {filterButtons.map((button) => (
          <FilterButton
            key={button.id}
            onClick={() => handleFilterClick(button.id)}
            active={activeFilter === button.id}
            dotColor={button.dotColor}
          >
            <StatusDot dotColor={button.dotColor} />
            {button.label}
          </FilterButton>
        ))}
      </FilterButtonsContainer>
    </PageHeaderContainer>
  );
};

const PageHeaderContainer = styled.h1`
display: flex;
flex-direction: column;
gap: 10px;
`;

const HeaderTitle = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 60px;
  letter-spacing: 0%;
  color: ${({ theme }) => theme.color.WhiteText};
  margin: 0;
`;

const FilterButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
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
  color: ${({ theme, active }) => active ? theme.color.primary : theme.color.lightText};
  background-color: ${({ theme, active }) => active ? theme.color.white : 'transparent'};
  border: none;
  cursor: pointer;
  padding: 16px;
  border-radius: 20px;
  box-shadow: ${({ active }) => active ? '0px 2px 8px 0px #00000026' : 'none'};
  width: 165px;
  height: 52px;
  transition: all 0.2s ease;

  &:hover {
    // background-color: ${({ theme }) => theme.color.background};
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ dotColor, theme }) => theme.color[dotColor] || dotColor};
`;