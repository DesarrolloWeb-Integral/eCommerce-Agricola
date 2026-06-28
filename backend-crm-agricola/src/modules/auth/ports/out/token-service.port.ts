import type { RolUsuario } from '../../../usuarios/domain/value-objects/rol-usuario.enum'

export interface JwtPayload {
  sub: string
  email: string
  role: RolUsuario
  jti?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const TOKEN_SERVICE_PORT = Symbol('TOKEN_SERVICE_PORT')

export interface TokenServicePort {
  generateAccessToken(payload: JwtPayload): Promise<string>

  generateRefreshToken(payload: JwtPayload): Promise<string>

  verifyRefreshToken(token: string): Promise<JwtPayload>
}
