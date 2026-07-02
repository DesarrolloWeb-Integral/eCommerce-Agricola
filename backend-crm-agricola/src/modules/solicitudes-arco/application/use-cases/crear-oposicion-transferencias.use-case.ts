import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { USUARIO_REPOSITORY_PORT } from 'src/modules/usuarios/ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { SolicitudArco } from '../../domain/entities/solicitud-arco'
import { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../../domain/value-objects/tipo-solicitud-arco.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

export interface CrearOposicionTransferenciasInput {
  userId: string
  reason: string
}

@Injectable()
export class CrearOposicionTransferenciasUseCase {
  private readonly pendingStatuses = [
    EstadoSolicitudArco.RECIBIDA,
    EstadoSolicitudArco.EN_REVISION,
    EstadoSolicitudArco.PENDIENTE_POR_OBLIGACIONES,
  ]

  constructor(
    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort,

    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(input: CrearOposicionTransferenciasInput): Promise<SolicitudArco> {
    const usuario = await this.usuarioRepository.findById(input.userId)

    if (!usuario || usuario.isCancelled()) {
      throw new BadRequestException('La cuenta no esta disponible para crear esta solicitud.')
    }

    const existing = await this.solicitudRepository.findByUserTypeAndStatuses(
      input.userId,
      TipoSolicitudArco.OPOSICION_TRANSFERENCIAS,
      this.pendingStatuses
    )

    if (existing) {
      throw new ConflictException('Ya existe una solicitud pendiente de este tipo.')
    }

    const now = new Date()
    usuario.disableOptionalPurposes(now)
    await this.usuarioRepository.save(usuario)

    const solicitud = new SolicitudArco(
      randomUUID(),
      input.userId,
      TipoSolicitudArco.OPOSICION_TRANSFERENCIAS,
      EstadoSolicitudArco.RECIBIDA,
      input.reason.trim(),
      'Oposicion a transferencias o finalidades no necesarias.',
      null,
      now,
      null,
      null,
      now,
      now
    )

    return this.solicitudRepository.save(solicitud)
  }
}
