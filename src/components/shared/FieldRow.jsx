// FieldRow.js
import styled from 'styled-components';

export const FieldRow = ({ children }) => {
  return <RowContainer>{children}</RowContainer>;
};

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
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