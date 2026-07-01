export interface PaymentSummary {
  pedidoId: string;
  subtotal: number;
  comision: number;
  total: number;
  montoProductor: number;
}

export interface StartCheckoutRequest {
  acceptedExternalPaymentConsent: true;
}

export interface StartCheckoutResponse extends PaymentSummary {
  pagoId: string;
  checkoutUrl: string;
}
