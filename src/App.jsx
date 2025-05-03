import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { ROUTE_CONFIG } from './config/routes.config';
import { ROUTES } from './constants/routes';
// import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthWithToast>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Toaster />
          {/* <AppRoutes /> */}
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

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // return <LoadingSpinner />;
  }

  return (
    <Suspense 
      // fallback={<LoadingSpinner />}
    >
      <Routes>
        {ROUTE_CONFIG.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isPublic || isAuthenticated 
                ? route.element 
                : <Navigate to={ROUTES.SIGNIN} state={{ from: route.path }} replace />
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
