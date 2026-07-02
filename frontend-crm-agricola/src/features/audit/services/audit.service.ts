import { apiClient } from '../../../../src/services/api-client';

export interface AuditLog {
  id: string;
  usuarioId: string;
  accion: string;
  recursoAfectado: string;
  detalle: string | null;
  createdAt: string;
}

export const auditService = {
  getLogs: async (): Promise<AuditLog[]> => {
    // Tu apiClient se encarga de inyectar las cookies, validar el estado y refrescar el token si expira
    return apiClient<AuditLog[]>('/auditoria', {
      method: 'GET',
      requiresAuth: true,
    });
  },
};
