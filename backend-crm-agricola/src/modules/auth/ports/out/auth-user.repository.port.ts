import type { RolUsuario } from '../../../usuarios/domain/value-objects/rol-usuario.enum'

export interface AuthUser {
  id: string
  email: string
  passwordHash: string
  refreshTokenHash: string | null
  role: RolUsuario
  isActive: boolean
}

export const AUTH_USER_REPOSITORY_PORT = Symbol('AUTH_USER_REPOSITORY_PORT')

export interface AuthUserRepositoryPort {
  findByEmail(email: string): Promise<AuthUser | null>

  findById(userId: string): Promise<AuthUser | null>

  updateRefreshTokenHash(userId: string, refreshTokenHash: string): Promise<void>

  clearRefreshTokenHash(userId: string): Promise<void>
}
