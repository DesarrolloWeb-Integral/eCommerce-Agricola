import { EstadoPedido } from 'src/modules/pedidos/domain/value-objects/estado-pedido.enum'

export interface PedidoParaPago {
  id: string
  clientId: string
  producerProfileId: string
  subtotal: number
  estado: EstadoPedido
}

export const PEDIDO_CONSULTA_PAGO_PORT = Symbol('PEDIDO_CONSULTA_PAGO_PORT')

export interface PedidoConsultaPagoPort {
  findById(id: string): Promise<PedidoParaPago | null>
}
