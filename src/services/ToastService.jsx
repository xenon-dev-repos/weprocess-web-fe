import React from 'react';
import { createContext, useContext, useState } from 'react';
import styled from 'styled-components';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
    
    return id;
  };

  const hideToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Helper methods for different toast types
  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);
  const showInfo = (message, duration) => showToast(message, 'info', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      hideToast, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning 
    }}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer>
          {toasts.map(toast => (
            <Toast key={toast.id} type={toast.type}>
              <ToastMessage>{toast.message}</ToastMessage>
              <CloseButton onClick={() => hideToast(toast.id)}>×</CloseButton>
            </Toast>
          ))}
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
};

// Hook for using toast
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Styled components for the toast UI
const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return 'var(--success-color, #4caf50)';
      case 'error': return 'var(--error-color, #f44336)';
      case 'warning': return 'var(--warning-color, #ff9800)';
      default: return 'var(--info-color, #2196f3)';
    }
  }};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  min-width: 250px;
  max-width: 350px;
  animation: slideIn 0.3s ease-out forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`; 