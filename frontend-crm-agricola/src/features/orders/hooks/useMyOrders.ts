import { useCallback, useEffect, useState } from 'react';

import { getMyOrders } from '../services';
import type { Order } from '../types';

interface UseMyOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  reloadOrders: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar tus pedidos.';
}

export function useMyOrders(): UseMyOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadOrders = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialOrders(): Promise<void> {
      try {
        const data = await getMyOrders();

        if (isMounted) {
          setOrders(data);
        }
      } catch (requestError: unknown) {
        if (isMounted) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    orders,
    isLoading,
    error,
    reloadOrders,
  };
}
