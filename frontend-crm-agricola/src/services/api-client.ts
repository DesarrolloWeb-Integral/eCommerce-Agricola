import { refreshTokens } from './token.service';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('La variable VITE_API_URL no está configurada.');
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  requiresAuth?: boolean;
  retryAfterRefresh?: boolean;
};

function getApiErrorMessage(data: unknown): string {
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return 'Ocurrió un error al realizar la solicitud.';
  }

  const { message } = data as { message: unknown };

  if (typeof message === 'string') return message;

  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === 'string');
    if (messages.length > 0) return messages.join(' ');
  }

  return 'Ocurrió un error al realizar la solicitud.';
}

export async function apiClient<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const {
    body,
    headers,
    requiresAuth = false,
    retryAfterRefresh = false,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    credentials: 'include',
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && requiresAuth && !retryAfterRefresh) {
    const wasRefreshed = await refreshTokens();

    if (wasRefreshed) {
      return apiClient<TResponse>(endpoint, {
        ...options,
        retryAfterRefresh: true,
      });
    }
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data));
  }

  return data as TResponse;
}
