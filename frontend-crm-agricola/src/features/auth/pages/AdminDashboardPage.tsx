import { useNavigate } from 'react-router-dom';
import { DashboardActionCard, RoleDashboard } from '../components';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <main className="container-xxl py-4">
      <RoleDashboard
        title="Panel de administrador"
        description="Bienvenido. Desde aquí podrás administrar usuarios, supervisar la plataforma y gestionar la información general del sistema."
        icon="bi-shield-lock"
      />

      <section aria-labelledby="admin-actions-title" className="mt-4">
        <div className="mb-3">
          <p className="text-uppercase text-success fw-semibold small mb-1">Herramientas</p>
          <h2 id="admin-actions-title" className="h4 fw-bold mb-0">
            Administración de la plataforma
          </h2>
        </div>

        {/* Contenedor principal de la rejilla */}
        <div className="row g-4">
          {/* Tarjeta 1: Consultar Usuarios */}
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

          {/* Tarjeta 2: Bitácora de Auditoría (Acomodada dentro del row) */}
          <div className="col-12 col-md-6 col-xl-4">
            <DashboardActionCard
              icon="bi-shield-check"
              title="Bitácora de auditoría"
              eyebrow="Historial de seguridad"
              description="Supervisa accesos erróneos, cancelaciones de cuentas y cambios críticos del sistema."
              buttonLabel="Ver registros"
              buttonIcon="bi-eye"
              onSelect={() => navigate('/auditoria')}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
