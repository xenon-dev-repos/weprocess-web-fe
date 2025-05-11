import { useMemo, useState } from 'react';
import { useToast } from '../services/ToastService';
import { CreateApiService } from '../services/ApiService';

/**
 * Custom hook that provides API methods with integrated toast notifications, including notifications API
 * @returns {Object} API methods with toast notifications and notification fetching
 */
export const useApi = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Create the API service with toast integration using useMemo
  // to prevent unnecessary re-creation on each render
  // const apiService = useMemo(() => CreateApiService(toast), [toast]);
  const apiService = useMemo(() => ({
    loading,
    ...CreateApiService(toast, setLoading)
  }), [toast, loading]);
  
  return apiService;
}; 