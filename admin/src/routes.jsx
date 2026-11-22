import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedAdminRoute from './features/admin/auth/ProtectedAdminRoute';
import Skeleton from './components/ui/Skeleton';

// Page Suspense Fallback
const PageLoading = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
    <Skeleton className="h-10 w-2/5" />
    <Skeleton className="h-6 w-3/5" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

// Lazy-loaded Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminAdmissionsPage = lazy(() => import('./pages/admin/AdminAdmissionsPage'));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage'));
const AdminContentCmsPage = lazy(() => import('./pages/admin/AdminContentCmsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

export const router = createBrowserRouter([
  // Admin Single-Gateway Authentication
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: <Navigate to="/admin/login" replace />,
  },

  // Protected Admin Management Dashboard
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <Suspense fallback={<PageLoading />}><AdminOverviewPage /></Suspense> },
          { path: 'admissions', element: <Suspense fallback={<PageLoading />}><AdminAdmissionsPage /></Suspense> },
          { path: 'enquiries', element: <Suspense fallback={<PageLoading />}><AdminEnquiriesPage /></Suspense> },
          { path: 'content', element: <Suspense fallback={<PageLoading />}><AdminContentCmsPage /></Suspense> },
          { path: 'settings', element: <Suspense fallback={<PageLoading />}><AdminSettingsPage /></Suspense> },
        ],
      },
    ],
  },

  // Direct root access aliases
  {
    path: '/',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'admissions', element: <Navigate to="/admin/admissions" replace /> },
          { path: 'enquiries', element: <Navigate to="/admin/enquiries" replace /> },
          { path: 'content', element: <Navigate to="/admin/content" replace /> },
          { path: 'settings', element: <Navigate to="/admin/settings" replace /> },
        ],
      },
    ],
  },

  // Catch-all fallback
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);

export default router;

