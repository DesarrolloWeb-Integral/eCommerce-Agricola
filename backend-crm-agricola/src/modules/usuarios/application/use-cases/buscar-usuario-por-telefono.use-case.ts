import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { Usuario } from '../../domain/entities/usuario'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'

@Injectable()
export class BuscarUsuarioPorTelefonoUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(phone: string): Promise<Usuario> {
    const normalizedPhone = phone.trim()

    const usuario = await this.usuarioRepository.findByPhone(normalizedPhone)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    return usuario
  }
}
