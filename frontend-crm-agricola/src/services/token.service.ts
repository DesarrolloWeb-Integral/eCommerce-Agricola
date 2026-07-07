const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

let refreshTokensPromise: Promise<boolean> | null = null;

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('La variable VITE_API_URL no esta configurada.');
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function refreshTokens(): Promise<boolean> {
  if (refreshTokensPromise) {
    return refreshTokensPromise;
  }

  refreshTokensPromise = refreshAccessTokens();

  try {
    return await refreshTokensPromise;
  } finally {
    refreshTokensPromise = null;
  }
}

async function refreshAccessTokens(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    clearTokens();

    return false;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      clearTokens();

      return false;
    }

    return true;
  } catch {
    clearTokens();

    return false;
  }
}
