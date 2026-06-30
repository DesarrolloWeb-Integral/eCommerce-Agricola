import { useNavigate } from 'react-router-dom';

import { DashboardActionCard, RoleDashboard } from '../components';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <main className="container-xxl">
      <RoleDashboard
        title="Panel de administrador"
        description="Bienvenido. Desde aquí podrás administrar usuarios, supervisar la plataforma y gestionar la información general del sistema."
        icon="bi-shield-lock"
      />

      <section aria-labelledby="admin-actions-title">
        <div className="mb-3">
          <p className="text-uppercase text-success fw-semibold small mb-1">Herramientas</p>

          <h2 id="admin-actions-title" className="h4 fw-bold mb-0">
            Administración de la plataforma
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-xl-4">
            <DashboardActionCard
              icon="bi-people"
              title="Consultar usuarios"
              eyebrow="Búsqueda por identificador."
              description="Revisa la información de una cuenta registrada mediante su UUID."
              buttonLabel="Consultar usuario"
              buttonIcon="bi-search"
              onSelect={() => navigate('/usuarios')}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
