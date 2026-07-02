import { EstadoSolicitudArco } from '../value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../value-objects/tipo-solicitud-arco.enum'

export class SolicitudArco {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: TipoSolicitudArco,
    public status: EstadoSolicitudArco,
    public reason: string | null,
    public requestedDataDescription: string | null,
    public response: string | null,
    public readonly requestedAt: Date,
    public resolvedAt: Date | null,
    public resolvedByUserId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  resolve({
    status,
    response,
    resolvedAt,
    resolvedByUserId,
  }: {
    status: EstadoSolicitudArco.ATENDIDA | EstadoSolicitudArco.IMPROCEDENTE
    response: string
    resolvedAt: Date
    resolvedByUserId: string
  }): void {
    this.status = status
    this.response = response
    this.resolvedAt = resolvedAt
    this.resolvedByUserId = resolvedByUserId
    this.updatedAt = resolvedAt
  }

  markAutomaticFulfillment(response: string, resolvedAt: Date): void {
    this.status = EstadoSolicitudArco.CUMPLIDA_AUTOMATICAMENTE
    this.response = response
    this.resolvedAt = resolvedAt
    this.updatedAt = resolvedAt
  }
}
