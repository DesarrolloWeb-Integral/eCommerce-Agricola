import { useContext } from 'react';

import { ToastContext, type ToastContextValue } from '../contexts/ToastContext';

export function useToast(): ToastContextValue {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error('useToast debe usarse dentro de ToastProvider.');
  }

  return toastContext;
}
