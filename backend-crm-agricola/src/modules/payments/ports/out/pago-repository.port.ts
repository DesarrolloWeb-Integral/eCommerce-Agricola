import type { Pago } from '../../domain/entities/pago'
import type { EstadoPago } from '../../domain/value-objects/estado-pago.enum'

export const PAGO_REPOSITORY_PORT = Symbol('PAGO_REPOSITORY_PORT')

export interface PagoRepositoryPort {
  save(pago: Pago): Promise<Pago>
  findById(id: string): Promise<Pago | null>
  findByPedidoId(pedidoId: string): Promise<Pago | null>
  findByMercadoPagoPaymentId(mercadoPagoPaymentId: string): Promise<Pago | null>
  findByClientId(clientId: string): Promise<Pago[]>
  findByProducerProfileId(producerProfileId: string): Promise<Pago[]>
  findByClientIdAndEstados(clientId: string, estados: EstadoPago[]): Promise<Pago[]>
  findByProducerProfileIdAndEstados(
    producerProfileId: string,
    estados: EstadoPago[]
  ): Promise<Pago[]>
}
