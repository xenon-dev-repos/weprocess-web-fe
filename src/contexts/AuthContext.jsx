import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Fetch user profile from localStorage or set a default value
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData) {
            setUser(userData);
          } else {
            // If we don't have the user data in localStorage, set a default authenticated user
            setUser({ 
              is_authenticated: true,
              email: localStorage.getItem('userEmail') || ''
            });
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Set a default authenticated user
          setUser({ is_authenticated: true });
        }
      }
    };

    checkAuth();
  }, []);

  const startRegistration = async (email, accountType) => {
    try {
      setLoading(true);
      setError(null);
      // Store the initial registration data
      setRegistrationData({ email, accountType });
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the form data being sent
      console.log('Submitting registration with:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // Determine which endpoint to use based on account type
      const endpoint = formData.get('type') === 'firm' 
        ? API_ENDPOINTS.REGISTER_FIRM 
        : API_ENDPOINTS.REGISTER_INDIVIDUAL;
      
      console.log('Using endpoint:', endpoint);
      
      // Make the API call to register the user
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);
      
      if (!data.success) {
        // Handle specific error messages from API
        let errorMessage = data.message || 'Registration failed';
        
        // If there are validation errors, format them
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            // Get the first error message
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Determine whether we have user or firm data in the response
      const userData = data.user || data.firm;
      
      if (!userData) {
        console.error('No user or firm data in response');
        throw new Error('Invalid response from server');
      }
      
      console.log('Got user data:', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email || '');
      
      // Set user state
      setUser(userData);
      
      // Clear registration data
      setRegistrationData(null);
      
      console.log('Registration successful:', data);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create form data for login
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      console.log('Attempting login for:', email);
      
      // Make the API call to login
      const response = await fetch(API_ENDPOINTS.LOGIN_INDIVIDUAL, {
        method: 'POST',
        body: formData
      });
      
      // console.log('Login response status:', response.status);
      const data = await response.json();
      // console.log('Login response data:', data);
      
      if (!data.success) {
        // Handle specific error messages from API
        let errorMessage = data.message || 'Login failed';
        
        // If there are validation errors, format them
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            // Get the first error message
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Determine whether we have user or firm data in the response
      const userData = data.user || data.firm;
      
      if (!userData) {
        console.error('No user or firm data in login response');
        throw new Error('Invalid response from server');
      }
      
      console.log('Got user data from login:', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email || '');
      
      // Set user state
      setUser(userData);
      
      console.log('Login successful:', data);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setResetPasswordEmail(email);
      
      // Create form data for forgot password request
      const formData = new FormData();
      formData.append('email', email);
      
      // Make the API call
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Failed to send password reset email';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('Password reset email sent');
      return true;
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send password reset email');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Alias for forgotPassword to maintain compatibility with ForgotPassword component
  const requestPasswordReset = forgotPassword;

  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create form data for OTP verification
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      
      // Make the API call
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Failed to verify OTP';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      setOtpVerified(true);
      console.log('OTP verified successfully');
      return true;
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Alias for verifyOtp to maintain compatibility with VerifyOTP component
  const verifyOTP = verifyOtp;

  const changePassword = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create form data for password change
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      // Make the API call
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Failed to change password';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Reset states
      setOtpVerified(false);
      setResetPasswordEmail('');
      
      console.log('Password changed successfully');
      return true;
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password) => {
    // Reset password uses the same endpoint as changePassword
    return await changePassword(email, password);
  };

  const value = {
    user,
    loading,
    error,
    token,
    registrationData,
    resetPasswordEmail,
    otpVerified,
    startRegistration,
    completeRegistration,
    login,
    logout,
    forgotPassword,
    requestPasswordReset, // Add alias
    verifyOtp,
    verifyOTP, // Add alias
    changePassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 