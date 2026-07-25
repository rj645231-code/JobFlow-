import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CompaniesPage from '@/pages/CompaniesPage';
import RecruitersPage from '@/pages/RecruitersPage';
import ApplicationsPage from '@/pages/ApplicationsPage';
import TemplatesPage from '@/pages/TemplatesPage';
import BulkEmailPage from '@/pages/BulkEmailPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ResumesPage from '@/pages/ResumesPage';
import SettingsPage from '@/pages/SettingsPage';
import JobDiscoveryPage from '@/pages/JobDiscoveryPage';
import AppLayout from '@/components/layout/AppLayout';

// Mock auth check (replace with real auth hook)
const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <AppLayout><Outlet /></AppLayout>;
};

const AuthRoute = () => {
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/companies', element: <CompaniesPage /> },
      { path: '/recruiters', element: <RecruitersPage /> },
      { path: '/applications', element: <ApplicationsPage /> },
      { path: '/applications/:id', element: <ApplicationsPage /> }, // Or a separate details page
      { path: '/templates', element: <TemplatesPage /> },
      { path: '/bulk-email', element: <BulkEmailPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/resumes', element: <ResumesPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/job-discovery', element: <JobDiscoveryPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
