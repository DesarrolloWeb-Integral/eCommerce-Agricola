import type { Pedido } from '../../domain/entities/pedido'

export const PEDIDO_REPOSITORY_PORT = Symbol('PEDIDO_REPOSITORY_PORT')

export interface PedidoRepositoryPort {
  save(pedido: Pedido): Promise<Pedido>
  findById(id: string): Promise<Pedido | null>
  findByClientId(clientId: string): Promise<Pedido[]>
  findByProducerProfileId(producerProfileId: string): Promise<Pedido[]>
}
