import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InstructionProvider } from './contexts/InstructionContext';
import { ToastProvider, useToast } from './services/ToastService';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { ROUTE_CONFIG } from './config/routes.config';
import { ROUTES } from './constants/routes';
// import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthWithToast>
          <InstructionProviderWithToast>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              <Toaster />
              <AppRoutes />
            </ThemeProvider>
          </InstructionProviderWithToast>
        </AuthWithToast>
      </ToastProvider>
    </Router>
  );
}

function AppRoutes() {
  const { isAuthenticated = true, loading } = useAuth();

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

const AuthWithToast = ({ children }) => {
  const toast = useToast();
  return <AuthProvider toast={toast}>{children}</AuthProvider>;
};

const InstructionProviderWithToast = ({ children }) => {
  const toast = useToast();
  return <InstructionProvider toast={toast}>{children}</InstructionProvider>;
};

export default App;
