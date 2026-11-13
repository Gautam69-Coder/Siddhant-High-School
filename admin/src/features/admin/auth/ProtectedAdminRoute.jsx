import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('shs_admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
