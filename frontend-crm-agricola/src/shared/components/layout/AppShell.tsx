import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../features/auth/hooks';
import { getDashboardPathByRole } from '../../../features/auth/utils';

import '../../../styles/AppShell.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isInitializing, logoutSession, user } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user ? getDashboardPathByRole(user.role) : '/dashboard';

  async function handleLogout(): Promise<void> {
    await logoutSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell bg-light">
      <header className="navbar navbar-expand bg-white border-bottom shadow-sm py-3">
        <div className="container-xxl">
          <Link
            to={dashboardPath}
            className="navbar-brand d-flex align-items-center gap-2 fw-bold text-success mb-0"
          >
            <span
              className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '2.5rem', height: '2.5rem' }}
              aria-hidden="true"
            >
              <i className="bi bi-flower1 fs-5" />
            </span>

            <span>
              AgroConecta
              <small className="d-block text-secondary fw-normal">Plataforma agrícola</small>
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            {user && (
              <span className="badge text-bg-light border text-secondary d-none d-md-inline-flex align-items-center gap-1">
                <i className="bi bi-person-badge text-success" aria-hidden="true" />
                {user.role}
              </span>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
                aria-label="Cerrar sesión"
                onClick={() => void handleLogout()}
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                <span className="d-none d-sm-inline">Cerrar sesión</span>
              </button>
            ) : (
              !isInitializing && (
                <Link
                  to="/login"
                  className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
                  <span className="d-none d-sm-inline">Iniciar sesión</span>
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      <div className="app-shell-main py-4 py-lg-5">{children}</div>

      <footer className="bg-white border-top py-3">
        <div className="container-xxl">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 text-secondary small">
            <span>AgroConecta · Plataforma para el sector agrícola</span>

            <span>
              <i
                className={`bi ${
                  isAuthenticated ? 'bi-shield-check' : 'bi-globe2'
                } text-success me-1`}
                aria-hidden="true"
              />
              {isAuthenticated ? 'Acceso protegido' : 'Vista pública'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
