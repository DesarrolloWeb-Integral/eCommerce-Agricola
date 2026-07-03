import { useCallback, useState } from 'react';

import { startPaymentCheckout } from '../services';
import type { StartCheckoutResponse } from '../types';

interface UseStartPaymentCheckoutResult {
  checkout: StartCheckoutResponse | null;
  isStartingCheckout: boolean;
  error: string | null;
  startCheckout: (
    orderId: string,
    acceptedExternalPaymentConsent: boolean
  ) => Promise<StartCheckoutResponse>;
  resetError: () => void;
}

export function useStartPaymentCheckout(): UseStartPaymentCheckoutResult {
  const [checkout, setCheckout] = useState<StartCheckoutResponse | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback((): void => {
    setError(null);
  }, []);

  const startCheckout = useCallback(
    async (
      orderId: string,
      acceptedExternalPaymentConsent: boolean
    ): Promise<StartCheckoutResponse> => {
      setIsStartingCheckout(true);
      setError(null);
      setCheckout(null);

      try {
        const data = await startPaymentCheckout(orderId, acceptedExternalPaymentConsent);
        setCheckout(data);
        return data;
      } catch (requestError: unknown) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo iniciar el checkout de Mercado Pago.';

        setError(message);
        throw requestError;
      } finally {
        setIsStartingCheckout(false);
      }
    },
    []
  );

  return {
    checkout,
    isStartingCheckout,
    error,
    startCheckout,
    resetError,
  };
}
