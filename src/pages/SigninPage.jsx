import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { ErrorMessage, ForgotPasswordLink, FormGroup, Input, Label, PasswordInputContainer, PasswordToggle, SubmitButton } from '../components/shared/FormElements';

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Welcome to WeProcess"
      subtitle="let’s get your law firm set up."
      signInText="Don't have an account?"
      signInLink="/signup"
      signInLinkText="Sign Up"
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle onClick={togglePasswordVisibility} type="button">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </PasswordToggle>
          </PasswordInputContainer>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Login'}
        </SubmitButton>
        
        <ForgotPasswordLink>
          <Link to="/forgot-password">Forgot your password?</Link>
        </ForgotPasswordLink>
      </form>
    </AuthLayout>
  );
};

// const FormGroup = styled.div`
//   margin-bottom: 1.5rem;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 0.5rem;
//   font-size: 1rem;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid #ccc;
//   border-radius: 0.5rem;
//   font-size: 1rem;
  
//   &:focus {
//     outline: none;
//     border-color: var(--primary-color);
//   }
// `;

// const PasswordInputContainer = styled.div`
//   position: relative;
// `;

// const PasswordToggle = styled.button`
//   position: absolute;
//   right: 12px;
//   top: 50%;
//   transform: translateY(-50%);
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 1.2rem;
// `;

// const ErrorMessage = styled.div`
//   color: red;
//   margin-bottom: 1rem;
// `;

// const LoginButton = styled.button`
//   width: 100%;
//   background-color: var(--primary-color);
//   color: white;
//   padding: 1rem;
//   border-radius: 20px;
//   font-size: 1rem;
//   font-weight: 600;
//   transition: background-color 0.2s;
//   margin-top: 1rem;
  
//   &:hover {
//     background-color: #122619;
//   }
  
//   &:disabled {
//     background-color: #999;
//     cursor: not-allowed;
//   }
// `;

// const ForgotPasswordLink = styled.div`
//   text-align: center;
//   margin-top: 1rem;
//   font-size: 0.9rem;
  
//   a {
//     color: var(--primary-color);
//     text-decoration: none;
    
//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

export default SigninPage; 