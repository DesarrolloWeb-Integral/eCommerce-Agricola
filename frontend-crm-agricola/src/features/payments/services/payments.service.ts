import { apiClient } from '../../../services';
import type { PaymentSummary, StartCheckoutRequest, StartCheckoutResponse } from '../types';

export function getPaymentSummary(orderId: string): Promise<PaymentSummary> {
  return apiClient<PaymentSummary>(`/pagos/pedidos/${encodeURIComponent(orderId)}/resumen`, {
    method: 'GET',
    requiresAuth: true,
  });
}

export function startPaymentCheckout(
  orderId: string,
  acceptedExternalPaymentConsent: boolean
): Promise<StartCheckoutResponse> {
  const body: StartCheckoutRequest = {
    acceptedExternalPaymentConsent,
  };

  return apiClient<StartCheckoutResponse>(
    `/pagos/pedidos/${encodeURIComponent(orderId)}/checkout`,
    {
      method: 'POST',
      body,
      requiresAuth: true,
    }
  );
}
