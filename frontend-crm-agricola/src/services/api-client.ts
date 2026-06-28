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
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Ocurrió un error al realizar la solicitud.';

    throw new Error(errorMessage);
  }

  return data as TResponse;
}
