import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Usuario } from '../../domain/entities/usuario'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'
import { RegistrarLogUseCase } from '../../../auditoria/application/use-cases/registrar-log.use-case'

@Injectable()
export class DesactivarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    private readonly registrarLogUseCase: RegistrarLogUseCase
  ) {}

  async execute(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    usuario.deactivate()
    await this.registrarLogUseCase.execute({
      usuarioId: id, // Quién ejecuta la acción (puede ser el admin o el mismo usuario)
      accion: 'CANCELACION_CUENTA',
      recursoAfectado: `Usuario:${id}`,
    })
    return this.usuarioRepository.save(usuario)
  }
}
