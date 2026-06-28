import type {
  PublicProducerProfile,
  PrivateProducerProfile,
  ProducerProfileFormData,
} from '../types/producer-profile.types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = Array.isArray(body?.message)
      ? body.message.join(' · ')
      : (body?.message ?? `Error ${res.status}`)
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

/** Crear perfil (productor autenticado) */
export async function createProducerProfile(
  data: Partial<ProducerProfileFormData>
): Promise<PrivateProducerProfile> {
  const res = await fetch(`${BASE_URL}/producer-profiles`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<PrivateProducerProfile>(res)
}

/** Actualizar perfil propio */
export async function updateProducerProfile(
  profileId: string,
  data: Partial<ProducerProfileFormData>
): Promise<PrivateProducerProfile> {
  const res = await fetch(`${BASE_URL}/producer-profiles/${profileId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<PrivateProducerProfile>(res)
}

/** Ver perfil propio (privado) */
export async function getOwnProducerProfile(): Promise<PrivateProducerProfile> {
  const res = await fetch(`${BASE_URL}/producer-profiles/me`, {
    headers: authHeaders(),
  })
  return handleResponse<PrivateProducerProfile>(res)
}

/** Ver perfil público de un productor por su profileId */
export async function getPublicProducerProfile(profileId: string): Promise<PublicProducerProfile> {
  const res = await fetch(`${BASE_URL}/producer-profiles/${profileId}/public`)
  return handleResponse<PublicProducerProfile>(res)
}
