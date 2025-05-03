import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider, useToast } from './services/ToastService';
import GlobalStyles from './styles/GlobalStyles';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import FirmSetupPage from './pages/FirmSetupPage';
import IndividualSetupPage from './pages/IndividualSetupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

// Wrapper component that injects toast into AuthProvider
const AuthWithToast = ({ children }) => {
  const toast = useToast();
  return <AuthProvider toast={toast}>{children}</AuthProvider>;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthWithToast>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Routes>
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/firm-setup" element={<FirmSetupPage />} />
              <Route path="/individual-setup" element={<IndividualSetupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </ThemeProvider>
        </AuthWithToast>
      </ToastProvider>
    </Router>
  );
}

export default App;
