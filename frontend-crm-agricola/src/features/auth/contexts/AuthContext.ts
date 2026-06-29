import { createContext } from 'react';

import type { AuthenticatedUser } from '../types';

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  loginSession: () => Promise<AuthenticatedUser>;
  logoutSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
