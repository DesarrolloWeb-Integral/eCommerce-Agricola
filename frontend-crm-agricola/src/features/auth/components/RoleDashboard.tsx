import { useAuth } from '../hooks';

interface RoleDashboardProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: string;
}

export function RoleDashboard({
  title,
  description,
  eyebrow = 'Panel principal',
  icon = 'bi-speedometer2',
}: RoleDashboardProps) {
  const { user } = useAuth();

  return (
    <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
      <div className="row align-items-center g-4">
        <div className="col-12 col-lg">
          <div className="d-flex align-items-start gap-3">
            <div
              className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '3.75rem', height: '3.75rem' }}
              aria-hidden="true"
            >
              <i className={`bi ${icon} fs-3`} />
            </div>

            <div>
              <p className="text-uppercase text-success fw-semibold small mb-1">{eyebrow}</p>

              <h1 className="h2 fw-bold mb-2">{title}</h1>

              <p className="text-secondary mb-0">{description}</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="col-12 col-lg-auto">
            <div className="card border bg-light rounded-4">
              <div className="card-body p-3">
                <p className="text-uppercase text-success fw-semibold small mb-2">Sesion activa</p>

                <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
                  <i className="bi bi-envelope text-success" aria-hidden="true" />
                  <span>{user.email}</span>
                </div>

                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <i className="bi bi-person-badge text-success" aria-hidden="true" />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
