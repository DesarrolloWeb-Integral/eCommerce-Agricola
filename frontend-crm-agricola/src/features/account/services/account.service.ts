import { apiClient } from '../../../services/api-client';
import type {
  AccountUser,
  ArcoRequest,
  CancellationData,
  UpdateAccountData,
} from '../types/account.types';

export function getMyAccount(): Promise<AccountUser> {
  return apiClient<AccountUser>('/usuarios/me', {
    method: 'GET',
    requiresAuth: true,
  });
}

export function updateMyAccount(data: UpdateAccountData): Promise<AccountUser> {
  return apiClient<AccountUser>('/usuarios/me', {
    method: 'PATCH',
    body: data,
    requiresAuth: true,
  });
}

export function acceptCurrentPrivacyNotice(): Promise<AccountUser> {
  return apiClient<AccountUser>('/usuarios/me/consentimientos', {
    method: 'POST',
    body: {
      privacyNoticeAccepted: true,
    },
    requiresAuth: true,
  });
}

export function getMyArcoRequests(): Promise<ArcoRequest[]> {
  return apiClient<ArcoRequest[]>('/solicitudes-arco/mis-solicitudes', {
    method: 'GET',
    requiresAuth: true,
  });
}

export function createTransferOpposition(reason: string): Promise<ArcoRequest> {
  return apiClient<ArcoRequest>('/solicitudes-arco/oposicion-transferencias', {
    method: 'POST',
    body: { reason },
    requiresAuth: true,
  });
}

export function exportMyData(): Promise<unknown> {
  return apiClient<unknown>('/usuarios/me/exportacion', {
    method: 'GET',
    requiresAuth: true,
  });
}

export function cancelMyAccount(data: CancellationData): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/usuarios/me/cancelacion', {
    method: 'POST',
    body: data,
    requiresAuth: true,
  });
}

export function keepMyAccount(): Promise<AccountUser> {
  return apiClient<AccountUser>('/usuarios/me/mantener-cuenta', {
    method: 'POST',
    requiresAuth: true,
  });
}
