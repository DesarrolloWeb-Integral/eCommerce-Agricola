// src/features/chat/pages/ChatPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversaciones } from '../hooks/useConversaciones';
import { VentanaChat } from '../components/VentanaChat';
import { useAuth } from '../../../features/auth/hooks';

export function ChatPage() {
  const { conversaciones, cargando } = useConversaciones();
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const rutaDashboard = user?.role === 'PROVEEDOR' ? '/dashboard/proveedor' : '/dashboard/cliente';

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 60px)' }}>
      <div className="d-flex align-items-center gap-2 p-3 border-bottom bg-white">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(rutaDashboard)}
        >
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Volver al panel
        </button>
      </div>

      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        <aside className="border-end" style={{ width: '300px' }}>
          <h5 className="p-3 mb-0">Conversaciones</h5>
          {cargando && <p className="px-3">Cargando...</p>}
          <ul className="list-group list-group-flush">
            {conversaciones.map((c) => (
              <li
                key={c.id}
                className={`list-group-item list-group-item-action ${seleccionada === c.id ? 'active' : ''}`}
                role="button"
                onClick={() => setSeleccionada(c.id)}
              >
                {c.clienteLabel ?? c.producerBusinessName}
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-grow-1">
          <VentanaChat conversacionId={seleccionada} />
        </main>
      </div>
    </div>
  );
}
