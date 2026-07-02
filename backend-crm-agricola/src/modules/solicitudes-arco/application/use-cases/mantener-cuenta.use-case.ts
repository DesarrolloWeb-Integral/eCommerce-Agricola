import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Usuario } from 'src/modules/usuarios/domain/entities/usuario'
import { EstadoCuenta } from 'src/modules/usuarios/domain/value-objects/estado-cuenta.enum'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../../domain/value-objects/tipo-solicitud-arco.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

@Injectable()
export class MantenerCuentaUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort
  ) {}

  async execute(userId: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(userId)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (usuario.estadoCuenta === EstadoCuenta.CANCELADA) {
      throw new ConflictException('La cuenta ya fue cancelada y no puede reactivarse.')
    }

    if (usuario.estadoCuenta !== EstadoCuenta.CANCELACION_PENDIENTE) {
      throw new ConflictException('La cuenta no tiene una cancelacion pendiente.')
    }

    const now = new Date()
    const solicitud = await this.solicitudRepository.findByUserTypeAndStatuses(
      userId,
      TipoSolicitudArco.CANCELACION,
      [
        EstadoSolicitudArco.RECIBIDA,
        EstadoSolicitudArco.EN_REVISION,
        EstadoSolicitudArco.PENDIENTE_POR_OBLIGACIONES,
      ]
    )

    usuario.keepAccount(now)

    if (solicitud) {
      solicitud.resolve({
        status: EstadoSolicitudArco.ATENDIDA,
        response: 'El usuario decidio mantener su cuenta y retiro la solicitud de cancelacion.',
        resolvedAt: now,
        resolvedByUserId: userId,
      })

      await this.solicitudRepository.save(solicitud)
    }

    return this.usuarioRepository.save(usuario)
  }
}
