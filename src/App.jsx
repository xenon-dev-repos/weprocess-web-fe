import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import FirmSetupPage from './pages/FirmSetupPage';
import IndividualSetupPage from './pages/IndividualSetupPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

function App() {
  return (
    <Router>
      <AuthProvider>
      <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/firm-setup" element={<FirmSetupPage />} />
            <Route path="/individual-setup" element={<IndividualSetupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
