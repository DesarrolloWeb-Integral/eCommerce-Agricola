import { SolicitudArco } from '../../../../../domain/entities/solicitud-arco'
import { SolicitudArcoEntity } from '../entities/solicitud-arco.entity'

export class SolicitudArcoMapper {
  static toDomain(entity: SolicitudArcoEntity): SolicitudArco {
    return new SolicitudArco(
      entity.id,
      entity.userId,
      entity.type,
      entity.status,
      entity.reason,
      entity.requestedDataDescription,
      entity.response,
      entity.requestedAt,
      entity.resolvedAt,
      entity.resolvedByUserId,
      entity.createdAt,
      entity.updatedAt
    )
  }

  static toPersistence(solicitud: SolicitudArco): SolicitudArcoEntity {
    const entity = new SolicitudArcoEntity()

    entity.id = solicitud.id
    entity.userId = solicitud.userId
    entity.type = solicitud.type
    entity.status = solicitud.status
    entity.reason = solicitud.reason
    entity.requestedDataDescription = solicitud.requestedDataDescription
    entity.response = solicitud.response
    entity.requestedAt = solicitud.requestedAt
    entity.resolvedAt = solicitud.resolvedAt
    entity.resolvedByUserId = solicitud.resolvedByUserId
    entity.createdAt = solicitud.createdAt
    entity.updatedAt = solicitud.updatedAt

    return entity
  }
}
