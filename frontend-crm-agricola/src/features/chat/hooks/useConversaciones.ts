import { useCallback, useEffect, useState } from 'react';
import { chatService } from '../services/chat.service';
import type { Conversacion } from '../types/chat.types';

export function useConversaciones() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    chatService
      .listarMisConversaciones()
      .then((data) => {
        if (cancelado) return;
        setConversaciones(data);
        setError(null);
      })
      .catch(() => {
        if (cancelado) return;
        setError('No se pudieron cargar tus conversaciones.');
      })
      .finally(() => {
        if (cancelado) return;
        setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await chatService.listarMisConversaciones();
      setConversaciones(data);
      setError(null);
    } catch {
      setError('No se pudieron cargar tus conversaciones.');
    } finally {
      setCargando(false);
    }
  }, []);

  return { conversaciones, cargando, error, recargar };
}
