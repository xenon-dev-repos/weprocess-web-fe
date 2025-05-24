import React from 'react';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import InstructionDetailsPage from '../pages/InstructionDetailsPage';
import InvoiceDetailsPage from '../pages/InvoiceDetailsPage';
import ProtectedRoute from './ProtectedRoute';
import { GlobalErrorFallbackPage } from '../pages/GlobalErrorFallbackPage';

const SignupPage = lazy(() => import('../pages/SignupPage'));
const SigninPage = lazy(() => import('../pages/SigninPage'));
const FirmSetupPage = lazy(() => import('../pages/FirmSetupPage'));
const IndividualSetupPage = lazy(() => import('../pages/IndividualSetupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const InstructionsPage = lazy(() => import('../pages/InstructionsPage'))
const InvoicesPage = lazy(() => import('../pages/InvoicesPage'));
const AddInstructionPage = lazy(() => import('../pages/AddInstructionPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));

export const ROUTE_CONFIG = [
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: ROUTES.SIGNIN,
    element: <SigninPage />,
  },
  {
    path: ROUTES.FIRM_SETUP,
    element: <FirmSetupPage />,
  },
  {
    path: ROUTES.INDIVIDUAL_SETUP,
    element: <IndividualSetupPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: ROUTES.ROOT,
    element: (<ProtectedRoute> <DashboardPage /> </ProtectedRoute>),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (<ProtectedRoute> <DashboardPage /> </ProtectedRoute>),
  },
  {
    path: ROUTES.INSTRUCTIONS,
    element: <ProtectedRoute> <InstructionsPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.INVOICES,
    element: <ProtectedRoute> <InvoicesPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.SETTINGS,
    element: <ProtectedRoute> <SettingsPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <ProtectedRoute> <NotificationsPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.ADD_INSTRUCTION,
    element: <ProtectedRoute> <AddInstructionPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.INSTRUCTION_DETAILS + '/:id',
    element: <ProtectedRoute> <InstructionDetailsPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.CHAT,
    element: <ProtectedRoute> <ChatPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.INVOICE_DETAILS + '/:id',
    element: <ProtectedRoute> <InvoiceDetailsPage /> </ProtectedRoute>,
    isPublic: false
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Navigate to={ROUTES.SIGNIN} replace />,
    isPublic: true
  }
];