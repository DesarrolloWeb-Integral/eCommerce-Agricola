import { useState } from 'react';

import { useConnectivity } from '../../hooks/useConnectivity';

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className = '' }: OfflineBannerProps) {
  const { isCheckingConnection, isOnline, retryConnection } = useConnectivity();
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  if (isOnline) {
    return null;
  }

  async function handleRetryConnection(): Promise<void> {
    setRetryMessage(null);
    const hasConnection = await retryConnection();

    if (!hasConnection) {
      setRetryMessage('Aun no hay conexion disponible.');
    }
  }

  return (
    <section
      className={`offline-banner ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Estado de conexion"
    >
      <div className="offline-banner-content">
        <span className="offline-banner-icon" aria-hidden="true">
          <i className="bi bi-wifi-off" />
        </span>

        <div>
          <p className="offline-banner-title mb-1">No hay conexion a Internet</p>
          <p className="offline-banner-text mb-0">
            Conectate a una red para iniciar sesion, consultar informacion o realizar operaciones.
          </p>
          {retryMessage && <p className="offline-banner-feedback mb-0">{retryMessage}</p>}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-success btn-sm offline-banner-action"
        onClick={() => void handleRetryConnection()}
        disabled={isCheckingConnection}
      >
        {isCheckingConnection ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            Reintentando...
          </>
        ) : (
          <>
            <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
            Reintentar conexion
          </>
        )}
      </button>
    </section>
  );
}
