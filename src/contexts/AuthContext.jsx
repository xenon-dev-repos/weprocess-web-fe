import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { 
  ToastError, 
  ToastSuccess, 
  ToastInfo,
  ToastLoading,
  ToastPromise
} from '../utils/toastUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  const startRegistration = async (email, accountType) => {
    try {
      setLoading(true);
      clearError();
      setRegistrationData({ email, accountType });
      return true;
    } catch (err) {
      ToastError(err.message || 'Registration failed')
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (formData) => {
    try {
      setLoading(true);
      clearError();

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
        ToastError(errorMessage);

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

      ToastSuccess('Registration successful');
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      ToastError('Registration error:');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      clearError();

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
        ToastError(errorMessage);

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
      ToastSuccess('Login successful.');
      return true;
    } catch (err) {
      console.error('Login error:', err);
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
      clearError();
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
        ToastError(errorMessage);
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
 
      ToastSuccess('Password reset email sent.')
      return true;
    } catch (err) {
      console.error('Forgot password error:', err);
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
      clearError();
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);

      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Failed to verify OTP';
        ToastError(errorMessage);
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      setOtpVerified(true);
      ToastSuccess('OTP verified successfully.');
      return true;
    } catch (err) {
      console.error('OTP verification error:', err);
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
      clearError();

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        let errorMessage = data.message || 'Failed to change password';
        ToastError(errorMessage);
        
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            errorMessage = data.errors[errorKeys[0]][0];
          }
        }
        
        throw new Error(errorMessage);
      }

      setOtpVerified(false);
      setResetPasswordEmail('');

      ToastSuccess('Password changed successfully.');
      return true;
    } catch (err) {
      console.error('Password change error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password) => {
    return await changePassword(email, password);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    return !!token && !!userData;
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
    resetPassword,
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);