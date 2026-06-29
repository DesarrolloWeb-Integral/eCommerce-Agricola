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
      <div style={{ padding: '0 1rem 1rem' }}>
        <button type="button" onClick={() => navigate('/dashboard/proveedor/perfil')}>
          Gestionar mi perfil de productor
        </button>
      </div>
    </>
  );
}
