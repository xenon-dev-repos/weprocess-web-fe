// DisplayField.jsx
import styled from 'styled-components';

export const DisplayField = ({ label, value }) => {
  return (
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value || '-'}</FieldValue>
    </FieldContainer>
  );
};

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const FieldLabel = styled.label`
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #656565;
`;

const FieldValue = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  // padding: 12px 0;
  // margin-top: 4px;
`;