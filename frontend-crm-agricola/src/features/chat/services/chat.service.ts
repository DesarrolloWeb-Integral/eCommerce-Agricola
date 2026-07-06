// src/features/chat/services/chat.service.ts
import { apiClient } from '../../../../src/services/api-client';
import type { Conversacion, IniciarConversacionPayload, Mensaje } from '../types/chat.types';

export const chatService = {
  listarMisConversaciones: async (): Promise<Conversacion[]> => {
    return apiClient<Conversacion[]>('/chat/conversaciones', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  iniciarConversacion: async (payload: IniciarConversacionPayload): Promise<Conversacion> => {
    return apiClient<Conversacion>('/chat/conversaciones', {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    });
  },

  listarMensajes: async (conversacionId: string): Promise<Mensaje[]> => {
    return apiClient<Mensaje[]>(`/chat/conversaciones/${conversacionId}/mensajes`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  enviarMensaje: async (conversacionId: string, contenido: string): Promise<Mensaje> => {
    return apiClient<Mensaje>(`/chat/conversaciones/${conversacionId}/mensajes`, {
      method: 'POST',
      body: { contenido },
      requiresAuth: true,
    });
  },
};
