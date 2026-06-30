import { Pedido } from '../../../../../domain/entities/pedido'
import { PedidoEntity } from '../entities/pedido.entity'

export class PedidoMapper {
  static toDomain(entity: PedidoEntity): Pedido {
    return new Pedido(
      entity.id,
      entity.clientId,
      entity.producerProfileId,
      entity.items,
      entity.subtotal,
      entity.estado,
      entity.createdAt,
      entity.updatedAt
    )
  }

  static toEntity(pedido: Pedido): PedidoEntity {
    const entity = new PedidoEntity()

    entity.id = pedido.id
    entity.clientId = pedido.clientId
    entity.producerProfileId = pedido.producerProfileId
    entity.items = pedido.items
    entity.subtotal = pedido.subtotal
    entity.estado = pedido.estado
    entity.createdAt = pedido.createdAt
    entity.updatedAt = pedido.updatedAt

    return entity
  }
}
