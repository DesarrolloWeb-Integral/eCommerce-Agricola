import { Navigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks';
import { getDashboardPathByRole } from '../../features/auth/utils';

export function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPathByRole(user.role)} replace />;
}
