import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const createLogger = () => ({
  showSuccess: (msg) => console.log('Success:', msg),
  showError: (msg) => console.error('Error:', msg),
  showInfo: (msg) => console.info('Info:', msg),
  showWarning: (msg) => console.warn('Warning:', msg),
});

export const AuthProvider = ({ children, toast = createLogger() }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const clearError = () => {
    setError(null);
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData) {
            setUser(userData);
          } else {
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

  const formatPhoneNumber = (value, phoneNumber) => {
    const isAdding = value.length > phoneNumber.length;
    const digitsOnly = value.replace(/\D/g, '');
    
    if (!isAdding) {
      return value;
    }
    
    // UK mobile format: 7700 900123 (10 digits)
    if (digitsOnly.startsWith('7')) {
      if (digitsOnly.length <= 4) return digitsOnly;
      if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
      return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 10)}`;
    }
    // UK landline format without leading 0: 20 7946 0958 (10 digits)
    else {
      if (digitsOnly.length <= 2) return digitsOnly;
      if (digitsOnly.length <= 6) return `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2)}`;
      return `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 6)} ${digitsOnly.slice(6, 10)}`;
    }
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  const startRegistration = async (email, accountType) => {
    try {
      setLoading(true);
      setRegistrationData({ email, accountType });
      return true;
    } catch (err) {
      toast.showError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (formData) => {
    try {
      setLoading(true);

      const endpoint = formData.get('type') === 'firm' 
        ? API_ENDPOINTS.REGISTER_FIRM 
        : API_ENDPOINTS.REGISTER_INDIVIDUAL;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Registration failed';

        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const userData = data.client || data.firm;
      
      if (!userData) {
        console.error('No user or firm data in response');
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email || '');
      
      setUser(userData);
      setRegistrationData(null);
      navigate('/dashboard'); 
      
      console.log('Registration successful:', data);
      toast.showSuccess(data.message || 'Registration successful!');
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      toast.showError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Login failed';

        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const userData = data.user || data.firm || data.client;
      
      if (!userData) {
        console.error('No user or firm data in login response');
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email || '');

      setUser(userData);
      
      console.log('Login successful:', data);
      toast.showSuccess(data.message || 'Login successful!');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      toast.showError(err.message || 'Login failed');
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
    toast.showInfo('You have been logged out');
    navigate('signin');
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setResetPasswordEmail(email);

      const formData = new FormData();
      formData.append('email', email);

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
      toast.showSuccess(data.message || 'Password reset email sent. Please check your inbox.');
      return true;
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.showError(err.message || 'Failed to send password reset email');
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

      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      
      console.log('Verifying OTP for:', email);
      
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'OTP verification failed';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('OTP verification successful');
      setOtpVerified(true);
      toast.showSuccess(data.message || 'OTP verified successfully');
      return true;
    } catch (err) {
      console.error('OTP verification error:', err);
      toast.showError(err.message || 'OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (email, password) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Password change failed';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('Password changed successfully');
      setOtpVerified(false);
      toast.showSuccess(data.message || 'Password changed successfully');
      return true;
    } catch (err) {
      console.error('Password change error:', err);
      toast.showError(err.message || 'Password change failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      console.log('Resetting password for:', email);
      
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Password reset failed';
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('Password reset successfully');
      setOtpVerified(false);
      toast.showSuccess(data.message || 'Password reset successfully');
      return true;
    } catch (err) {
      console.error('Password reset error:', err);
      toast.showError(err.message || 'Password reset failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    return !!token && !!userData;
  };

  const getServes = async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        status: params.status || '',
        deadline: params.deadline || '',
        sort_by: params.sort_by || 'deadline,price',
        sort_order: params.sort_order || 'desc,asc',
        per_page: params.per_page || 10,
        user_id: params.user_id || ''
      }).toString();

      const response = await axios.get(`${API_ENDPOINTS.SERVES}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }
      console.log('Serves fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching serves:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch serves';
      toast.showError(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
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
    requestPasswordReset,
    verifyOtp,
    changePassword,
    resetPassword,
    clearError,
    isAuthenticated,
    navigate,
    formatPhoneNumber,
    getServes,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);