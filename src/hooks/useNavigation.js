import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { clearError } = useAuth();

  const navigateTo = (url, options) => {
    clearError();
    navigate(url, options);
  };

  return { navigateTo };
};