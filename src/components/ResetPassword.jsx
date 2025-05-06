import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();
  const { navigateTo } = useNavigation();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const verified = location.state?.verified || false;
  
  useEffect(() => {
    if (!email || !verified) {
      navigateTo('/forgot-password');
    }
  }, [email, verified, navigateTo]);
  
  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain at least one number, one uppercase and one lowercase letter
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validate passwords
    if (!password || !confirmPassword) {
      setError('Please enter both passwords');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and contain at least one number, one uppercase and one lowercase letter');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await resetPassword(email, password);
      
      if (success) {
        setMessage('Password reset successful');
        setTimeout(() => {
          navigateTo('/login', { state: { message: 'Your password has been reset successfully. You can now login with your new password.' } });
        }, 2000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Create a new password for your account
        </p>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter new password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Confirm new password"
            />
          </div>
          
          <div className="password-requirements">
            <p>Password must:</p>
            <ul>
              <li className={password.length >= 8 ? 'valid' : 'invalid'}>
                Be at least 8 characters long
              </li>
              <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                Contain at least one uppercase letter
              </li>
              <li className={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
                Contain at least one lowercase letter
              </li>
              <li className={/\d/.test(password) ? 'valid' : 'invalid'}>
                Contain at least one number
              </li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
          
          <div className="auth-links">
            <p>
              <a href="/login">Back to Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 