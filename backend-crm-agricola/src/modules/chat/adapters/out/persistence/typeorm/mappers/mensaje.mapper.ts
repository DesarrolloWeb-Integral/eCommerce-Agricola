import { Mensaje } from '../../../../../domain/entities/mensaje'
import { MensajeEntity } from '../entities/mensaje.entity'

export class MensajeMapper {
  static toDomain(entity: MensajeEntity): Mensaje {
    return new Mensaje(
      entity.id,
      entity.conversacionId,
      entity.remitenteId,
      entity.contenido,
      entity.createdAt
    )
  }
}
