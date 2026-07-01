import type { Pago } from '../../domain/entities/pago'

export const PAGO_REPOSITORY_PORT = Symbol('PAGO_REPOSITORY_PORT')

export interface PagoRepositoryPort {
  save(pago: Pago): Promise<Pago>
  findById(id: string): Promise<Pago | null>
  findByPedidoId(pedidoId: string): Promise<Pago | null>
  findByMercadoPagoPaymentId(mercadoPagoPaymentId: string): Promise<Pago | null>
}
