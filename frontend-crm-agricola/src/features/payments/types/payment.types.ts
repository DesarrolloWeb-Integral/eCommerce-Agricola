export interface PaymentSummary {
  pedidoId: string;
  subtotal: number;
  comision: number;
  total: number;
  montoProductor: number;
}

export interface StartCheckoutRequest {
  acceptedExternalPaymentConsent: boolean;
}

export interface StartCheckoutResponse extends PaymentSummary {
  pagoId: string;
  checkoutUrl: string;
}
