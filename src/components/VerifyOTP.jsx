import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { verifyOTP, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await verifyOTP(email, otp);
      
      if (success) {
        setMessage('OTP verified successfully');
        setTimeout(() => {
          navigate('/reset-password', { state: { email, verified: true } });
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOTP = async () => {
    setError('');
    setMessage('Resending OTP...');
    
    try {
      const success = await requestPasswordReset(email);
      
      if (success) {
        setMessage('A new OTP has been sent to your email');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        <p className="auth-subtitle">
          Enter the one-time password sent to {email}
        </p>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">One-Time Password</label>
            <input
              type="text"
              id="otp"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter the OTP"
              maxLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <div className="auth-links">
            <p>
              Didn't receive the OTP? 
              <button 
                type="button" 
                className="btn-link" 
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </p>
            <p>
              <a href="/forgot-password">Use a different email</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP; 