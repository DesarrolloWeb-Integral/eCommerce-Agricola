import { Inject, Injectable } from '@nestjs/common'

import type { SolicitudArco } from '../../domain/entities/solicitud-arco'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

@Injectable()
export class ListarSolicitudesArcoUseCase {
  constructor(
    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort
  ) {}

  execute(): Promise<SolicitudArco[]> {
    return this.solicitudRepository.findAll()
  }
}
