import { Conversacion } from '../../../../../domain/entities/conversacion'
import { ConversacionEntity } from '../entities/conversacion.entity'

export class ConversacionMapper {
  static toDomain(entity: ConversacionEntity): Conversacion {
    return new Conversacion(
      entity.id,
      entity.clienteId,
      entity.producerProfileId,
      entity.productoId,
      entity.pedidoId,
      entity.createdAt,
      entity.updatedAt
    )
  }
}
