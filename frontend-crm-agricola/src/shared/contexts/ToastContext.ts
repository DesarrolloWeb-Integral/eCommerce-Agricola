import { createContext } from 'react';

import type { ShowToastOptions } from '../types/toast.types';

export interface ToastContextValue {
  showToast: (message: string, options?: ShowToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
