import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ConnectivityContext } from '../contexts/ConnectivityContext';

const CONNECTION_CHECK_TIMEOUT_MS = 2500;
const OFFLINE_RECHECK_INTERVAL_MS = 5000;

interface ConnectivityProviderProps {
  children: ReactNode;
}

function getNavigatorOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

async function probeCurrentOrigin(): Promise<boolean> {
  if (!getNavigatorOnline()) {
    return false;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CONNECTION_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(`/?pwa-online-check=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function ConnectivityProvider({ children }: ConnectivityProviderProps) {
  const [isOnline, setIsOnline] = useState(getNavigatorOnline);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const probeIdRef = useRef(0);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    const probeId = probeIdRef.current + 1;
    probeIdRef.current = probeId;
    setIsCheckingConnection(true);

    const nextOnlineState = await probeCurrentOrigin();

    if (probeIdRef.current === probeId) {
      setIsOnline(nextOnlineState);
      setIsCheckingConnection(false);
    }

    return nextOnlineState;
  }, []);

  useEffect(() => {
    function handleOffline(): void {
      probeIdRef.current += 1;
      setIsOnline(false);
      setIsCheckingConnection(false);
    }

    function handleOnline(): void {
      void retryConnection();
    }

    function handleVisibilityChange(): void {
      if (!document.hidden) {
        void retryConnection();
      }
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const initialCheckId = window.setTimeout(() => {
      void retryConnection();
    }, 0);

    return () => {
      window.clearTimeout(initialCheckId);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [retryConnection]);

  useEffect(() => {
    if (isOnline) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void retryConnection();
    }, OFFLINE_RECHECK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isOnline, retryConnection]);

  const contextValue = useMemo(
    () => ({
      isOnline,
      isCheckingConnection,
      retryConnection,
    }),
    [isCheckingConnection, isOnline, retryConnection]
  );

  return (
    <ConnectivityContext.Provider value={contextValue}>{children}</ConnectivityContext.Provider>
  );
}
