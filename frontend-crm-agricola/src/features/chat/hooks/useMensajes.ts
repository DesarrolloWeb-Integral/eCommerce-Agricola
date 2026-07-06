import { useCallback, useEffect, useState } from 'react';
import { chatService } from '../services/chat.service';
import type { Mensaje } from '../types/chat.types';

export function useMensajes(conversacionId: string | null) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(!!conversacionId);

  useEffect(() => {
    if (!conversacionId) return;

    let cancelado = false;

    chatService
      .listarMensajes(conversacionId)
      .then((data) => {
        if (cancelado) return;
        setMensajes(data);
      })
      .finally(() => {
        if (cancelado) return;
        setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [conversacionId]);

  const enviar = useCallback(
    async (contenido: string) => {
      if (!conversacionId) return;
      const nuevo = await chatService.enviarMensaje(conversacionId, contenido);
      setMensajes((prev) => [...prev, nuevo]);
    },
    [conversacionId]
  );

  const recargar = useCallback(async () => {
    if (!conversacionId) return;
    setCargando(true);
    try {
      const data = await chatService.listarMensajes(conversacionId);
      setMensajes(data);
    } finally {
      setCargando(false);
    }
  }, [conversacionId]);

  return { mensajes, cargando, enviar, recargar };
}
