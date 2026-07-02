import type { SolicitudArco } from '../../domain/entities/solicitud-arco'
import type { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import type { TipoSolicitudArco } from '../../domain/value-objects/tipo-solicitud-arco.enum'

export const SOLICITUD_ARCO_REPOSITORY_PORT = Symbol('SOLICITUD_ARCO_REPOSITORY_PORT')

export interface SolicitudArcoRepositoryPort {
  save(solicitud: SolicitudArco): Promise<SolicitudArco>
  findById(id: string): Promise<SolicitudArco | null>
  findByUserId(userId: string): Promise<SolicitudArco[]>
  findAll(): Promise<SolicitudArco[]>
  findByUserTypeAndStatuses(
    userId: string,
    type: TipoSolicitudArco,
    statuses: EstadoSolicitudArco[]
  ): Promise<SolicitudArco | null>
  findByTypeAndStatuses(
    type: TipoSolicitudArco,
    statuses: EstadoSolicitudArco[]
  ): Promise<SolicitudArco[]>
}
