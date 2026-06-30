import { useState } from 'react';

import { createOrder } from '../services';
import type { CreateOrderRequest, Order } from '../types';

interface UseCreateOrderResult {
  isCreating: boolean;
  error: string | null;
  createClientOrder: (orderData: CreateOrderRequest) => Promise<Order>;
}

export function useCreateOrder(): UseCreateOrderResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createClientOrder(orderData: CreateOrderRequest): Promise<Order> {
    setIsCreating(true);
    setError(null);

    try {
      return await createOrder(orderData);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error ? requestError.message : 'No se pudo crear el pedido.';

      setError(message);
      throw requestError;
    } finally {
      setIsCreating(false);
    }
  }

  return {
    isCreating,
    error,
    createClientOrder,
  };
}
