import { useState } from 'react';

import { cancelOrder } from '../services';
import type { Order } from '../types';

interface UseCancelOrderResult {
  isCancelling: boolean;
  error: string | null;
  cancelClientOrder: (orderId: string) => Promise<Order>;
}

export function useCancelOrder(): UseCancelOrderResult {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelClientOrder(orderId: string): Promise<Order> {
    setIsCancelling(true);
    setError(null);

    try {
      return await cancelOrder(orderId);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error ? requestError.message : 'No se pudo cancelar el pedido.';

      setError(message);
      throw requestError;
    } finally {
      setIsCancelling(false);
    }
  }

  return {
    isCancelling,
    error,
    cancelClientOrder,
  };
}
