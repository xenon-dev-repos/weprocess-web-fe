import styled from 'styled-components';

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.body};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.body};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PasswordInputContainer = styled.div`
  position: relative;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: ${({ theme }) => theme.spacing.md};
  border: none;
  
  &:hover {
    background-color: #122619;
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
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
;`

export const PhoneInputContainer = styled.div`
display: flex;
align-items: center;
`;

export const CountryCode = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem 0 0 0.5rem;
  border-right: none;
  background-color: #f9f9f9;
  font-size: 1rem;
`;

export const FlagIcon = styled.span`
  margin-right: 0.5rem;
`;

export const PhoneInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0 0.5rem 0.5rem 0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;
