import React from 'react';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

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

export const ROUTE_CONFIG = [
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
    isPublic: true
  },
  {
    path: ROUTES.SIGNIN,
    element: <SigninPage />,
    isPublic: true
  },
  {
    path: ROUTES.FIRM_SETUP,
    element: <FirmSetupPage />,
    isPublic: true
  },
  {
    path: ROUTES.INDIVIDUAL_SETUP,
    element: <IndividualSetupPage />,
    isPublic: true
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
    isPublic: true
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
    isPublic: true
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    isPublic: false
  },
  {
    path: ROUTES.INSTRUCTIONS,
    element: <InstructionsPage />,
    isPublic: false
  },
  {
    path: ROUTES.INVOICES,
    element: <InvoicesPage />,
    isPublic: false
  },
  {
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
    isPublic: false
  },
  {
    path: ROUTES.ADD_INSTRUCTION,
    element: <AddInstructionPage />,
    isPublic: false
  },
  {
    path: ROUTES.ROOT,
    element: <DashboardPage />,
    isPublic: false
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Navigate to={ROUTES.SIGNIN} replace />,
    isPublic: true
  }
];