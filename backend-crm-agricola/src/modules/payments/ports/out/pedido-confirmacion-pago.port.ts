export const PEDIDO_CONFIRMACION_PAGO_PORT = Symbol('PEDIDO_CONFIRMACION_PAGO_PORT')

export interface PedidoConfirmacionPagoPort {
  confirmarPorPago(pedidoId: string): Promise<void>
}
