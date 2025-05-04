import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FormGroup, Input, Label, SubmitButton } from '../components/shared/FormElements';
import { AuthLayout } from '../layouts/AuthLayout';
import { useNavigation } from '../hooks/useNavigation';
import { useApi } from '../hooks/useApi';
import { ToastProvider } from '../services/ToastService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const { loading, setLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const api = useApi();
  const otpInputs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      ToastProvider.showError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 4) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 4) {
          newOtp[i] = pasteData[i];
        }
      }
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      ToastProvider.showError('Please enter a 4-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.verifyOtp(email, otpCode);
      if (response.success) {
        setIsOtpVerified(true);
      }
    } catch (err) {
      ToastProvider.showError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      ToastProvider.showError('Password do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.resetPassword(email, newPassword);
      navigateTo('/signin');
    } catch (err) {
      ToastProvider.showError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    navigateTo('/signin');
  };

  return (
    <AuthLayout
      title={isOtpVerified ? "Reset Password" : isSubmitted ? "Enter OTP" : "Forgot Password"}
      subtitle={
        isOtpVerified ? "Enter your new password" : 
        isSubmitted ? "We've sent a 4-digit code to your email" : 
        "Enter your email to reset your password"
      }
      signInText="Remember your password?"
      signInLink="/signin"
      signInLinkText="Sign In"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </SubmitButton>
          
          <BackLink onClick={handleBackToLogin}>
            Back to Sign In
          </BackLink>
        </form>
      ) : !isOtpVerified ? (
        <form onSubmit={handleVerifyOtp}>
          <FormGroup>
            <Label>Enter 4-digit OTP</Label>
            <OtpContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  ref={(el) => (otpInputs.current[index] = el)}
                  required
                />
              ))}
            </OtpContainer>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </SubmitButton>
          
          <BackLink onClick={handleBackToLogin}>
            Back to Sign In
          </BackLink>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <FormGroup>
            <Label>New Password</Label>
            <PasswordInputContainer>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
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
          
          <FormGroup>
            <Label>Confirm Password</Label>
            <PasswordInputContainer>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
              />
              <PasswordToggle onClick={toggleConfirmPasswordVisibility} type="button">
                {showConfirmPassword ? (
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
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </SubmitButton>
          
          <BackLink onClick={handleBackToLogin}>
            Back to Sign In
          </BackLink>
        </form>
      )}
    </AuthLayout>
  );
};

const BackLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  cursor: pointer;
  color: var(--color-primary-500);
  
  &:hover {
    text-decoration: underline;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
`;

const OtpInput = styled.input`
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px rgba(0, 100, 0, 0.1);
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
`;


export default ForgotPasswordPage;