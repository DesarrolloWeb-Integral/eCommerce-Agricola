import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Usuario } from '../../domain/entities/usuario'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'

@Injectable()
export class BuscarUsuarioPorEmailUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(email: string): Promise<Usuario> {
    const normalizedEmail = email.trim().toLowerCase()

    const usuario = await this.usuarioRepository.findByEmail(normalizedEmail)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    return usuario
  }
}
