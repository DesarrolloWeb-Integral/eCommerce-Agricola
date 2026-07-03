import type { UserRole } from '../../auth/types';

export type AccountStatus = 'ACTIVA' | 'CANCELACION_PENDIENTE' | 'CANCELADA';

export interface AccountUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  estadoCuenta: AccountStatus;
  privacyNoticeAcceptedAt: string | null;
  privacyNoticeVersion: string | null;
  optionalPurposesAllowed: boolean;
  optionalPurposesUpdatedAt: string | null;
  cancellationRequestedAt: string | null;
  cancelledAt: string | null;
  personalDataDisassociatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAccountData {
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface ArcoRequest {
  id: string;
  type: string;
  status: string;
  reason: string | null;
  requestedDataDescription: string | null;
  response: string | null;
  requestedAt: string;
  resolvedAt: string | null;
}

export interface CancellationData {
  currentPassword: string;
  confirmCancellation: boolean;
}
