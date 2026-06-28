import { apiClient } from '../../../services';
import type { UserProfile } from '../types';

export async function getUserById(userId: string): Promise<UserProfile> {
  return apiClient<UserProfile>(`/usuarios/${userId}`, {
    method: 'GET',
    requiresAuth: true,
  });
}
