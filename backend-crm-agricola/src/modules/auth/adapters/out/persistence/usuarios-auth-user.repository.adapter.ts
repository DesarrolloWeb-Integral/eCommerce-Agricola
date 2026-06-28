import { Inject, Injectable } from '@nestjs/common'

import type { AuthUser, AuthUserRepositoryPort } from '../../../ports/out/auth-user.repository.port'
import { USUARIO_REPOSITORY_PORT } from '../../../../usuarios/ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../../../usuarios/ports/out/usuario-repository.port'

@Injectable()
export class UsuariosAuthUserRepositoryAdapter implements AuthUserRepositoryPort {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const usuario = await this.usuarioRepository.findByEmailIncludingDeleted(email)

    if (!usuario) {
      return null
    }

    return {
      id: usuario.id,
      email: usuario.email,
      passwordHash: usuario.passwordHash,
      refreshTokenHash: usuario.refreshTokenHash,
      role: usuario.role,
      isActive: usuario.isActive,
    }
  }

  async findById(userId: string): Promise<AuthUser | null> {
    const usuario = await this.usuarioRepository.findById(userId)

    if (!usuario) {
      return null
    }

    return {
      id: usuario.id,
      email: usuario.email,
      passwordHash: usuario.passwordHash,
      refreshTokenHash: usuario.refreshTokenHash,
      role: usuario.role,
      isActive: usuario.isActive,
    }
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string): Promise<void> {
    const usuario = await this.usuarioRepository.findById(userId)

    if (!usuario) {
      throw new Error('No fue posible actualizar el refresh token: usuario no encontrado.')
    }

    usuario.updateRefreshTokenHash(refreshTokenHash)

    await this.usuarioRepository.save(usuario)
  }

  async clearRefreshTokenHash(userId: string): Promise<void> {
    const usuario = await this.usuarioRepository.findById(userId)

    if (!usuario) {
      throw new Error('No fue posible eliminar el refresh token: usuario no encontrado.')
    }

    usuario.clearRefreshTokenHash()

    await this.usuarioRepository.save(usuario)
  }
}
