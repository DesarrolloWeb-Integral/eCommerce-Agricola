import type { Pedido } from '../../domain/entities/pedido'
import type { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'

export const PEDIDO_REPOSITORY_PORT = Symbol('PEDIDO_REPOSITORY_PORT')

export interface PedidoRepositoryPort {
  save(pedido: Pedido): Promise<Pedido>
  findById(id: string): Promise<Pedido | null>
  findByClientId(clientId: string): Promise<Pedido[]>
  findByProducerProfileId(producerProfileId: string): Promise<Pedido[]>
  findByClientIdAndEstados(clientId: string, estados: EstadoPedido[]): Promise<Pedido[]>
  findByProducerProfileIdAndEstados(
    producerProfileId: string,
    estados: EstadoPedido[]
  ): Promise<Pedido[]>
}
