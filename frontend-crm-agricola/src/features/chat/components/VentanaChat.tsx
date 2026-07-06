// src/features/chat/components/VentanaChat.tsx
import { useState } from 'react';
import { useMensajes } from '../hooks/useMensajes';
import { useAuth } from '../../../features/auth/hooks';

interface Props {
  conversacionId: string | null;
}

export function VentanaChat({ conversacionId }: Props) {
  const { mensajes, cargando, enviar } = useMensajes(conversacionId);
  const { user } = useAuth();
  const [texto, setTexto] = useState('');

  const handleEnviar = async (): Promise<void> => {
    const contenido = texto.trim();
    if (!contenido) return;
    setTexto('');
    await enviar(contenido);
  };

  if (!conversacionId) {
    return <div className="p-4 text-muted">Selecciona una conversacion.</div>;
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {cargando && <p>Cargando mensajes...</p>}
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`d-flex mb-2 ${m.remitenteId === user?.id ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`p-2 rounded ${m.remitenteId === user?.id ? 'bg-primary text-white' : 'bg-light'}`}
              style={{ maxWidth: '70%' }}
            >
              {m.contenido}
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2 p-3 border-top">
        <input
          className="form-control"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
          maxLength={2000}
          placeholder="Escribe un mensaje..."
        />
        <button className="btn btn-primary" onClick={handleEnviar}>
          Enviar
        </button>
      </div>
    </div>
  );
}
