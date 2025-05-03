import toast from 'react-hot-toast';

const toastStyles = {
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '14px',
};

export const ToastError = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      ...toastStyles,
      color: '#ff4d4f',
      borderLeft: '4px solid #ff4d4f',
    },
  });
};

export const ToastSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      ...toastStyles,
      color: '#52c41a',
      borderLeft: '4px solid #52c41a',
    },
  });
};

export const ToastInfo = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...toastStyles,
      color: '#1890ff',
      borderLeft: '4px solid #1890ff',
    },
    icon: 'ℹ️',
  });
};

export const ToastWarning = (message) => {
  toast(message, {
    duration: 4500,
    position: 'top-right',
    style: {
      ...toastStyles,
      color: '#faad14',
      borderLeft: '4px solid #faad14',
    },
    icon: '⚠️',
  });
};

export const ToastLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: toastStyles,
  });
};

// For promise-based operations
export const ToastPromise = (promise, messages) => {
  return toast.promise(promise, messages, {
    position: 'top-right',
    style: toastStyles,
    success: {
      style: {
        ...toastStyles,
        color: '#52c41a',
        borderLeft: '4px solid #52c41a',
      },
    },
    error: {
      style: {
        ...toastStyles,
        color: '#ff4d4f',
        borderLeft: '4px solid #ff4d4f',
      },
    },
  });
};