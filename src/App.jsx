import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider, ScrollRestoration  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { InstructionProvider } from './contexts/InstructionContext';
import { ToastProvider, useToast } from './services/ToastService';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { ROUTE_CONFIG } from './config/routes.config';
import { ROUTES } from './constants/routes';
import { NotificationProvider } from './components/NotificationBadge';
import { NavigationHandler } from './hooks/NavigationHandler';
import { GlobalErrorFallbackPage } from './pages/GlobalErrorFallbackPage';

function App() {
  const router = createBrowserRouter(
    ROUTE_CONFIG.map(route => ({
      path: route.path,
      element: (
        <ToastProvider>
          <AuthWithToast>
            <InstructionProviderWithToast>
              <NavigationHandler>
                <ThemeProvider theme={theme}>
                  <NotificationProvider>
                    <GlobalStyles />
                    <Toaster />
                    <ScrollRestoration />
                    <Suspense>
                      {route.element}
                    </Suspense>
                  </NotificationProvider>
                </ThemeProvider>
              </NavigationHandler>
            </InstructionProviderWithToast>
          </AuthWithToast>
        </ToastProvider>
      ),
      errorElement: <GlobalErrorFallbackPage />,
    }))
  );

  return <RouterProvider router={router} />;
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
