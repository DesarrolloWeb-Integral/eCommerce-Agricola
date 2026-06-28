import { useAuth } from '../hooks';

interface RoleDashboardProps {
  title: string;
  description: string;
}

export function RoleDashboard({ title, description }: RoleDashboardProps) {
  const { logoutSession, user } = useAuth();

  async function handleLogout(): Promise<void> {
    await logoutSession();
  }

  return (
    <main>
      <h1>{title}</h1>

      <p>{description}</p>

      {user && (
        <section>
          <h2>Información de sesión</h2>

          <p>
            <strong>Correo:</strong> {user.email}
          </p>

          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </section>
      )}

      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  );
}
