import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Usuario } from '../../domain/entities/usuario'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'

@Injectable()
export class DesactivarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    usuario.deactivate()

    return this.usuarioRepository.save(usuario)
  }
}
