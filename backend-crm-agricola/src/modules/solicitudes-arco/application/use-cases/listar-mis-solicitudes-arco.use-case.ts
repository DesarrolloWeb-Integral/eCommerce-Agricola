import { Inject, Injectable } from '@nestjs/common'

import type { SolicitudArco } from '../../domain/entities/solicitud-arco'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

@Injectable()
export class ListarMisSolicitudesArcoUseCase {
  constructor(
    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort
  ) {}

  execute(userId: string): Promise<SolicitudArco[]> {
    return this.solicitudRepository.findByUserId(userId)
  }
}
