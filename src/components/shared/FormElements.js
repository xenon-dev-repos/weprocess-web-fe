import styled from 'styled-components';

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const FormGroup2 = styled.div`
  width: ${props => props.$isDateField ? '100%' : '50%'};

  @media (max-width: 1024px) {
   width: 100%;
  }

  @media (max-width: 768px) {
   width: 100%;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #656565;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 16px;
  border: 2px solid var(--color-border-secondary);
  border-radius: 12px;
  font-size: 1rem;
  height: ${({ $height }) => $height || '48px'};
  box-size: border-box;
  
  &:focus {
    outline: none;
    border-color: var(--color-border-primary);
  }
`;

export const PasswordInputContainer = styled.div`
  position: relative;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

export const ErrorMessage = styled.div`
  color: var(--color-error-500);
  margin-bottom: 16px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: var(--color-primary-500);
  color: var(--color-text-secondary);
  padding: 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 16px;
  border: none;
  
  &:hover {
    background-color: var(--color-primary-400);
  }
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

export const ForgotPasswordLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  
  a {
    color: var(--color-primary-500);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CountryCode = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid var(--color-border-secondary);
  border-radius: 12px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-border-primary);
  }
`;

export const FlagIcon = styled.img`
  width: 27px;
  height: 20px;
`;