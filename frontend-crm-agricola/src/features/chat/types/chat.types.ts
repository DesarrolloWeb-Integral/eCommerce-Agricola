// src/features/chat/types/chat.types.ts
export interface Conversacion {
  id: string;
  producerProfileId: string;
  producerBusinessName: string;
  clienteLabel?: string;
  productoId: string | null;
  pedidoId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Mensaje {
  id: string;
  remitenteId: string;
  contenido: string;
  createdAt: string;
}

export interface IniciarConversacionPayload {
  producerProfileId: string;
  productoId?: string;
  pedidoId?: string;
  mensaje: string;
}
