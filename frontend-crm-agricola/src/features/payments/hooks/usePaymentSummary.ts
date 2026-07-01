import { useCallback, useEffect, useState } from 'react';

import { getPaymentSummary } from '../services';
import type { PaymentSummary } from '../types';

interface UsePaymentSummaryResult {
  summary: PaymentSummary | null;
  isLoading: boolean;
  error: string | null;
  reloadSummary: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar el resumen del pago.';
}

export function usePaymentSummary(orderId: string): UsePaymentSummaryResult {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadSummary = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const data = await getPaymentSummary(orderId);
      setSummary(data);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary(): Promise<void> {
      setIsLoading(true);
      setError(null);
      setSummary(null);

      try {
        const data = await getPaymentSummary(orderId);

        if (isMounted) {
          setSummary(data);
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

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return {
    summary,
    isLoading,
    error,
    reloadSummary,
  };
}
