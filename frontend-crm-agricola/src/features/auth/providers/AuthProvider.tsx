import { useEffect, useState, type ReactNode } from 'react';

import { clearTokens } from '../../../services';
import { useConnectivity } from '../../../shared/hooks/useConnectivity';
import { AuthContext } from '../contexts/AuthContext';
import { getAuthenticatedUser, logoutUser, refreshAccessToken } from '../services';
import type { AuthenticatedUser } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isOnline } = useConnectivity();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(isOnline);

  useEffect(() => {
    let isCurrentRequest = true;

    async function restoreSession(): Promise<void> {
      clearTokens();

      if (!isOnline) {
        setUser(null);
        setIsAuthenticated(false);
        setIsInitializing(false);
        return;
      }

      setIsInitializing(true);

      try {
        await refreshAccessToken();

        if (!isCurrentRequest) {
          return;
        }

        const authenticatedUser = await getAuthenticatedUser();

        if (isCurrentRequest) {
          setUser(authenticatedUser);
          setIsAuthenticated(true);
        }
      } catch {
        if (isCurrentRequest) {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isCurrentRequest) {
          setIsInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isCurrentRequest = false;
    };
  }, [isOnline]);

  async function loginSession(): Promise<AuthenticatedUser> {
    try {
      const authenticatedUser = await getAuthenticatedUser();

      setUser(authenticatedUser);
      setIsAuthenticated(true);

      return authenticatedUser;
    } catch (error: unknown) {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      throw error;
    }
  }

  async function logoutSession(): Promise<void> {
    try {
      await logoutUser();
    } catch {
      // Aunque el refresh token ya no sea válido, la sesión local se elimina.
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        loginSession,
        logoutSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
