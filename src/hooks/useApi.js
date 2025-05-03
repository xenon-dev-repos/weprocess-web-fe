import { useMemo } from 'react';
import { useToast } from '../services/ToastService';
import { createApiService } from '../services/ApiService';

/**
 * Custom hook that provides API methods with integrated toast notifications
 * @returns {Object} API methods with toast notifications
 */
export const useApi = () => {
  const toast = useToast();
  
  // Create the API service with toast integration using useMemo
  // to prevent unnecessary re-creation on each render
  const apiService = useMemo(() => createApiService(toast), [toast]);
  
  return apiService;
}; 