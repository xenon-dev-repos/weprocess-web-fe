import styled from 'styled-components';

export const InstructionsMainContainerStyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1440px) {
    gap: 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 18px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;


export const InstructionsMainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background: rgba(255, 255, 255, 0.97);

  @media (max-width: 1440px) {
    gap: 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
  }

  @media (max-width: 1024px) {
    gap: 18px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

export const CustomDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E4E8EE;
`;

