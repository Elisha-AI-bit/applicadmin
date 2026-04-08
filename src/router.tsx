import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import LandingPage from '@/components/LandingPage';

// Auth pages
import { Login } from '@/pages/auth/LoginStyled';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Dashboard
import { Dashboard } from '@/pages/dashboard/Index';

// Applications
import { ApplicationsList } from '@/pages/applications/Index';
import { ApplicationDetail } from '@/pages/applications/Detail';

// Students
import { StudentsList } from '@/pages/students/Index';
import { StudentDetail } from '@/pages/students/Detail';
import { StudentImport } from '@/pages/students/Import';

// Payments
import { PaymentsList } from '@/pages/payments/Index';
import { PaymentDetail } from '@/pages/payments/Detail';

// Schools
import { SchoolsList } from '@/pages/schools/Index';
import { SchoolDetail } from '@/pages/schools/Detail';
import { SchoolEdit } from '@/pages/schools/Edit';
import { ProgramsList } from '@/pages/programs/Index';
import { ProgramEdit } from '@/pages/programs/Edit';

// Communications
import { Communications } from '@/pages/communications/Index';
import { SendNotification } from '@/pages/communications/Send';
import { Templates } from '@/pages/communications/Templates';

// Reports
import { Reports } from '@/pages/reports/Index';
import { ApplicationsReport } from '@/pages/reports/Applications';
import { FinancialReport } from '@/pages/reports/Financial';

// Users
import { UsersList } from '@/pages/users/Index';
import { CreateUser } from '@/pages/users/Create';
import { EditUser } from '@/pages/users/Edit';

// Settings
import { Settings } from '@/pages/settings/Index';
import { ProfileSettings } from '@/pages/settings/Profile';
import { SecuritySettings } from '@/pages/settings/Security';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'applications',
        children: [
          { index: true, element: <ApplicationsList /> },
          { path: ':id', element: <ApplicationDetail /> },
        ],
      },
      {
        path: 'students',
        children: [
          { index: true, element: <StudentsList /> },
          { path: 'import', element: <StudentImport /> },
          { path: ':id', element: <StudentDetail /> },
        ],
      },
      {
        path: 'payments',
        children: [
          { index: true, element: <PaymentsList /> },
          { path: ':id', element: <PaymentDetail /> },
        ],
      },
      {
        path: 'schools',
        children: [
          { index: true, element: <SchoolsList /> },
          { path: 'new', element: <SchoolEdit /> },
          { path: ':id', element: <SchoolDetail /> },
          { path: ':id/edit', element: <SchoolEdit /> },
        ],
      },
      {
        path: 'programs',
        children: [
          { index: true, element: <ProgramsList /> },
          { path: 'new', element: <ProgramEdit /> },
          { path: ':id/edit', element: <ProgramEdit /> },
        ],
      },
      {
        path: 'communications',
        children: [
          { index: true, element: <Communications /> },
          { path: 'send', element: <SendNotification /> },
          { path: 'templates', element: <Templates /> },
        ],
      },
      {
        path: 'reports',
        children: [
          { index: true, element: <Reports /> },
          { path: 'applications', element: <ApplicationsReport /> },
          { path: 'financial', element: <FinancialReport /> },
        ],
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <UsersList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/new',
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <CreateUser />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/:id/edit',
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        children: [
          { index: true, element: <Settings /> },
          { path: 'profile', element: <ProfileSettings /> },
          { path: 'security', element: <SecuritySettings /> },
        ],
      },
    ],
  },
]);
