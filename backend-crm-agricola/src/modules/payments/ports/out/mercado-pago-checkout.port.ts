export const MERCADO_PAGO_CHECKOUT_PORT = Symbol('MERCADO_PAGO_CHECKOUT_PORT')

export interface CrearCheckoutMercadoPagoInput {
  externalReference: string
  title: string
  total: number
}

export interface CheckoutMercadoPago {
  preferenceId: string
  checkoutUrl: string
}

export interface MercadoPagoCheckoutPort {
  crearCheckout(input: CrearCheckoutMercadoPagoInput): Promise<CheckoutMercadoPago>
}
