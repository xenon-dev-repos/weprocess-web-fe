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

function App() {
  const router = createBrowserRouter(
    ROUTE_CONFIG.map(route => ({
      path: route.path,
      element: (
        <ToastProvider>
          <AuthWithToast>
            <InstructionProviderWithToast>
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
            </InstructionProviderWithToast>
          </AuthWithToast>
        </ToastProvider>
      )
    }))
  );

  return <RouterProvider router={router} />;
}

// function App() {
//   return (
//     <Router>
//       <ToastProvider>
//         <AuthWithToast>
//           <InstructionProviderWithToast>
//             <ThemeProvider theme={theme}>
//             <NotificationProvider>
//                 <GlobalStyles />
//                 <Toaster />
//                 <AppRoutes />
//             </NotificationProvider>
//             </ThemeProvider>
//           </InstructionProviderWithToast>
//         </AuthWithToast>
//       </ToastProvider>
//     </Router>
//   );
// }

// function AppRoutes() {
//   const { isAuthenticated = true } = useAuth();

//   return (
//     <>
//       <Suspense>
//         <Routes>
//           {ROUTE_CONFIG.map((route) => (
//             <Route
//               key={route.path}
//               path={route.path}
//               element={
//                 route.isPublic || isAuthenticated
//                   ? route.element 
//                   : <Navigate to={ROUTES.SIGNIN} state={{ from: route.path }} replace />
//               }
//             />
//           ))}
//         </Routes>
//       </Suspense>
//     </>
//   );
// }

const AuthWithToast = ({ children }) => {
  const toast = useToast();
  return <AuthProvider toast={toast}>{children}</AuthProvider>;
};

const InstructionProviderWithToast = ({ children }) => {
  const toast = useToast();
  return <InstructionProvider toast={toast}>{children}</InstructionProvider>;
};

export default App;
