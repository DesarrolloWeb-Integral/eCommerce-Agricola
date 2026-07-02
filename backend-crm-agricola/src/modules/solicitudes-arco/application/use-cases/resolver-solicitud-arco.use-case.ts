import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { SolicitudArco } from '../../domain/entities/solicitud-arco'
import { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

export interface ResolverSolicitudArcoInput {
  solicitudId: string
  status: EstadoSolicitudArco.ATENDIDA | EstadoSolicitudArco.IMPROCEDENTE
  response: string
  resolvedByUserId: string
}

@Injectable()
export class ResolverSolicitudArcoUseCase {
  constructor(
    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort
  ) {}

  async execute(input: ResolverSolicitudArcoInput): Promise<SolicitudArco> {
    const solicitud = await this.solicitudRepository.findById(input.solicitudId)

    if (!solicitud) {
      throw new NotFoundException('Solicitud ARCO no encontrada.')
    }

    solicitud.resolve({
      status: input.status,
      response: input.response.trim(),
      resolvedAt: new Date(),
      resolvedByUserId: input.resolvedByUserId,
    })

    return this.solicitudRepository.save(solicitud)
  }
}
