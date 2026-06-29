import { apiClient } from '../../services/api-client';
import type {
  PublicProducerProfile,
  PrivateProducerProfile,
  ProducerProfileFormData,
} from '../types/producer-profile.types';

export async function createProducerProfile(
  data: Partial<ProducerProfileFormData>
): Promise<PrivateProducerProfile> {
  return apiClient<PrivateProducerProfile>('/producer-profiles', {
    method: 'POST',
    body: data,
    requiresAuth: true,
  });
}

export async function updateProducerProfile(
  profileId: string,
  data: Partial<ProducerProfileFormData>
): Promise<PrivateProducerProfile> {
  return apiClient<PrivateProducerProfile>(`/producer-profiles/${profileId}`, {
    method: 'PATCH',
    body: data,
    requiresAuth: true,
  });
}

export async function getOwnProducerProfile(): Promise<PrivateProducerProfile> {
  return apiClient<PrivateProducerProfile>('/producer-profiles/me', {
    requiresAuth: true,
  });
}

export async function getPublicProducerProfile(profileId: string): Promise<PublicProducerProfile> {
  return apiClient<PublicProducerProfile>(`/producer-profiles/${profileId}/public`);
}

export async function searchProducersByName(query: string): Promise<PublicProducerProfile[]> {
  return apiClient<PublicProducerProfile[]>(
    `/producer-profiles/search?q=${encodeURIComponent(query)}`
  );
}

export async function getRecommendedProducers(limit = 6): Promise<PublicProducerProfile[]> {
  return apiClient<PublicProducerProfile[]>(`/producer-profiles/recommended?limit=${limit}`);
}
