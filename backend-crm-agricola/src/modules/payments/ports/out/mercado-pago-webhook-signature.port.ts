export const MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT = Symbol('MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT')

export interface ValidarFirmaWebhookMercadoPagoInput {
  xSignature: string | undefined
  xRequestId: string | undefined
  dataId: string | undefined
}

export interface MercadoPagoWebhookSignaturePort {
  validar(input: ValidarFirmaWebhookMercadoPagoInput): void
}
