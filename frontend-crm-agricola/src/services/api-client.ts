const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('La variable VITE_API_URL no está configurada.')
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiClient<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const { body, headers, ...requestOptions } = options

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data: unknown = await response.json()

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Ocurrió un error al realizar la solicitud.'

    throw new Error(errorMessage)
  }

  return data as TResponse
}
