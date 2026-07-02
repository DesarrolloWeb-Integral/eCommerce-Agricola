import type { CookieOptions, Request, Response } from 'express'

import type { AuthTokens } from '../../../../ports/out/token-service.port'

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken'
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

function getBaseCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  }
}

export function getAuthCookieValue(request: Request, cookieName: string): string | null {
  const cookies: unknown = request.cookies

  if (!cookies || typeof cookies !== 'object') {
    return null
  }

  const cookieValue = (cookies as Record<string, unknown>)[cookieName]

  return typeof cookieValue === 'string' ? cookieValue : null
}

export function getRefreshTokenFromCookie(request: Request): string | null {
  return getAuthCookieValue(request, REFRESH_TOKEN_COOKIE_NAME)
}

export function setAuthCookies(response: Response, tokens: AuthTokens): void {
  response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
    ...getBaseCookieOptions(),
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })

  response.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    ...getBaseCookieOptions(),
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, getBaseCookieOptions())
  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getBaseCookieOptions())
}
