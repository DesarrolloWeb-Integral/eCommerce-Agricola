import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks';

export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Verificando sesión...</span>
          </div>
          <p className="text-secondary mb-0">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
