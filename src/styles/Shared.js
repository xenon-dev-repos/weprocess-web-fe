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

export const StatusBadge = styled.div`
  min-width: 77px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 4px 12px;
  background: #FFE5E5;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  color: #b71c1c;
  vertical-align: middle;
`;

