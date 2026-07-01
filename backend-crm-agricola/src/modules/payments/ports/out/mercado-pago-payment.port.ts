export const MERCADO_PAGO_PAYMENT_PORT = Symbol('MERCADO_PAGO_PAYMENT_PORT')

export interface PagoMercadoPago {
  id: string
  status: string
  externalReference: string | null
  transactionAmount: number
  currencyId: string
}

export interface MercadoPagoPaymentPort {
  obtenerPorId(paymentId: string): Promise<PagoMercadoPago>
}
