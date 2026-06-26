import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Usuario } from '../../domain/entities/usuario'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'

@Injectable()
export class BuscarUsuarioPorIdUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    return usuario
  }
}
