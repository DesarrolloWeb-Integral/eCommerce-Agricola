import type { UserRole } from '../types';

const DASHBOARD_PATHS: Record<UserRole, string> = {
  ADMINISTRADOR: '/dashboard/administrador',
  CLIENTE: '/dashboard/cliente',
  PROVEEDOR: '/dashboard/proveedor',
};

export function getDashboardPathByRole(role: UserRole): string {
  return DASHBOARD_PATHS[role];
}
