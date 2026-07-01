import { useState } from 'react';

import { confirmOrder } from '../services';
import type { Order } from '../types';

interface UseConfirmOrderResult {
  isConfirming: boolean;
  error: string | null;
  confirmProviderOrder: (orderId: string) => Promise<Order>;
}

export function useConfirmOrder(): UseConfirmOrderResult {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmProviderOrder(orderId: string): Promise<Order> {
    setIsConfirming(true);
    setError(null);

    try {
      return await confirmOrder(orderId);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error ? requestError.message : 'No se pudo confirmar el pedido.';

      setError(message);
      throw requestError;
    } finally {
      setIsConfirming(false);
    }
  }

  return {
    isConfirming,
    error,
    confirmProviderOrder,
  };
}
