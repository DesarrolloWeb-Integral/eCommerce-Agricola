import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useConnectivity } from '../../../shared/hooks/useConnectivity';

import '../../../styles/OfflinePage.css';

interface OfflineLocationState {
  from?: {
    pathname?: string;
    search?: string;
  };
}

function getRetryPath(locationState: OfflineLocationState | null): string {
  const pathname = locationState?.from?.pathname;
  const search = locationState?.from?.search ?? '';

  if (!pathname || pathname === '/offline') {
    return '/login';
  }

  return `${pathname}${search}`;
}

export function OfflinePage() {
  const { isCheckingConnection, retryConnection } = useConnectivity();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as OfflineLocationState | null;
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  async function handleRetryConnection(): Promise<void> {
    setRetryMessage(null);
    const hasConnection = await retryConnection();

    if (hasConnection) {
      navigate(getRetryPath(locationState), {
        replace: true,
      });
      return;
    }

    setRetryMessage('Aun no hay conexion disponible. Revisa tu red e intenta nuevamente.');
  }

  return (
    <main className="offline-page container-xxl">
      <section className="offline-page-panel bg-white border shadow-sm">
        <div className="offline-page-icon" aria-hidden="true">
          <i className="bi bi-wifi-off" />
        </div>

        <div>
          <p className="text-uppercase small fw-semibold text-success mb-2">Modo sin conexion</p>
          <h1 className="h2 fw-bold mb-3">Sin conexion a Internet</h1>
          <p className="lead text-secondary mb-0">
            Puedes navegar por la aplicacion instalada, pero necesitas conexion para iniciar sesion,
            consultar informacion o realizar operaciones.
          </p>
        </div>

        <div className="offline-page-actions">
          <button
            type="button"
            className="btn btn-success offline-page-primary-action"
            onClick={() => void handleRetryConnection()}
            disabled={isCheckingConnection}
          >
            {isCheckingConnection ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Reintentando conexion...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
                Reintentar conexion
              </>
            )}
          </button>

          <Link to="/login" className="btn btn-outline-success">
            <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
            Ir al login
          </Link>
        </div>

        {retryMessage && (
          <div className="alert alert-warning mb-0" role="alert">
            {retryMessage}
          </div>
        )}

        <div className="offline-page-static-links">
          <Link to="/aviso-privacidad" className="link-success fw-semibold text-decoration-none">
            Aviso de privacidad
          </Link>
        </div>
      </section>
    </main>
  );
}
