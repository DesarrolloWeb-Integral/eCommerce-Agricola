import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks';

export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <p>Verificando sesión...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
