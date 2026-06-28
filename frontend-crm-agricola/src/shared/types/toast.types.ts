export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ShowToastOptions {
  type?: ToastType;
  duration?: number;
}

export interface ToastVisualConfig {
  icon: string;
  title: string;
  headerClassName: string;
  iconClassName: string;
}
