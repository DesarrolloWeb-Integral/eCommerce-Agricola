import { useNavigate } from 'react-router-dom';
import { RoleDashboard } from '../components';

export function ProviderDashboardPage() {
  const navigate = useNavigate();
  return (
    <>
      <RoleDashboard
        title="Panel de proveedor"
        description="Bienvenido. Desde aquí podrás administrar tus productos, revisar pedidos y gestionar tu actividad como proveedor."
      />
      <div className="container py-3">
        <div className="row g-3">
          <div className="col-sm-6 col-md-4">
            <div
              className="card border-0 shadow-sm h-100"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/proveedor/perfil')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/proveedor/perfil')}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <span style={{ fontSize: '2rem' }}>🏪</span>
                <div>
                  <h6 className="fw-bold mb-1">Mi perfil de productor</h6>
                  <p className="text-muted small mb-0">
                    Configura tu nombre comercial, ubicación y contacto.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <span className="btn btn-outline-success btn-sm w-100">Gestionar perfil →</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div
              className="card border-0 shadow-sm h-100"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/proveedor/productos')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/proveedor/productos')}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <span style={{ fontSize: '2rem' }}>📦</span>
                <div>
                  <h6 className="fw-bold mb-1">Mis productos</h6>
                  <p className="text-muted small mb-0">
                    Registra, edita y administra tu catálogo de productos.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <span className="btn btn-outline-success btn-sm w-100">Ver productos →</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div
              className="card border-0 shadow-sm h-100"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/proveedor/pedidos')}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  navigate('/dashboard/proveedor/pedidos');
                }
              }}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <span style={{ fontSize: '2rem' }}>📋</span>

                <div>
                  <h6 className="fw-bold mb-1">Pedidos recibidos</h6>
                  <p className="text-muted small mb-0">
                    Revisa los pedidos realizados sobre tus productos.
                  </p>
                </div>
              </div>

              <div className="card-footer bg-transparent border-0">
                <span className="btn btn-outline-success btn-sm w-100">Ver pedidos →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
