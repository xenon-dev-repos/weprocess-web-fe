import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const CustomSelect = ({ options, defaultValue, onChange }) => {
    const initialOption = defaultValue 
    ? options.find(opt => opt.value === defaultValue) || options[0]
    : options[0];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange && onChange(option.value);
    setIsOpen(false);
  };

  return (
    <SelectContainer ref={selectRef}>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        {selectedOption.label}
        <SelectArrow $isOpen={isOpen}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#4B5563" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SelectArrow>
      </SelectButton>
      
      {isOpen && (
        <OptionsList>
          {options.map((option, index) => (
            <OptionItem
              key={index}
              onClick={() => handleOptionClick(option)}
              $isSelected={option.value === selectedOption.value} 
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 120px;
`;

const SelectButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background-color: white;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #043F35;
  }

  &:focus {
    border-color: #043F35;
    box-shadow: 0 0 0 2px rgba(4, 63, 53, 0.1);
  }
`;

const SelectArrow = styled.span`
  margin-left: 8px;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
`;

const OptionItem = styled.li`
  padding: 8px 16px;
  color: ${props => props.$isSelected ? 'white' : '#1f2937'};
  background-color: ${props => props.$isSelected ? '#043F35' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$isSelected ? '#043F35' : '#f0f0f0'};
    color: ${props => props.$isSelected ? 'white' : '#043F35'};
  }
`;

export default CustomSelect
