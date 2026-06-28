import { useContext } from 'react';

import { AuthContext, type AuthContextValue } from '../contexts/AuthContext';

export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return authContext;
}
