import { useNavigate } from 'react-router-dom';

import { DashboardActionCard, RoleDashboard } from '../components';

export function ProviderDashboardPage() {
  const navigate = useNavigate();

  return (
    <main className="container-xxl">
      <RoleDashboard
        title="Panel de proveedor"
        description="Bienvenido. Desde aquí podrás administrar tus productos, revisar pedidos y gestionar tu actividad como proveedor."
        icon="bi-shop"
      />

      <section aria-labelledby="provider-actions-title">
        <div className="mb-3">
          <p className="text-uppercase text-success fw-semibold small mb-1">Accesos rápidos</p>

          <h2 id="provider-actions-title" className="h4 fw-bold mb-0">
            Gestiona tu operación
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-xl-4">
            <DashboardActionCard
              icon="bi-person-vcard"
              title="Mi perfil de productor"
              eyebrow="Información pública del negocio."
              description="Configura tu nombre comercial, ubicación y medios de contacto."
              buttonLabel="Gestionar perfil"
              buttonIcon="bi-pencil-square"
              onSelect={() => navigate('/dashboard/proveedor/perfil')}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <DashboardActionCard
              icon="bi-box-seam"
              title="Mis productos"
              eyebrow="Catálogo propio."
              description="Registra, edita y administra los productos que ofreces."
              buttonLabel="Ver productos"
              buttonIcon="bi-bag-check"
              onSelect={() => navigate('/dashboard/proveedor/productos')}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <DashboardActionCard
              icon="bi-clipboard-check"
              title="Pedidos recibidos"
              eyebrow="Solicitudes de clientes."
              description="Revisa y confirma los pedidos realizados sobre tus productos."
              buttonLabel="Ver pedidos"
              buttonIcon="bi-list-check"
              onSelect={() => navigate('/dashboard/proveedor/pedidos')}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
