import { createContext } from 'react';

export interface ConnectivityContextValue {
  isOnline: boolean;
  isCheckingConnection: boolean;
  retryConnection: () => Promise<boolean>;
}

export const ConnectivityContext = createContext<ConnectivityContextValue | null>(null);
