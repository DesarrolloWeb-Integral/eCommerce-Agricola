import type { Toast, ToastType, ToastVisualConfig } from '../../types/toast.types';

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (toastId: string) => void;
}

function getToastVisualConfig(type: ToastType): ToastVisualConfig {
  const toastConfig: Record<ToastType, ToastVisualConfig> = {
    success: {
      icon: 'bi-check-circle-fill',
      title: 'Operación completada',
      headerClassName: 'bg-success-subtle text-success-emphasis',
      iconClassName: 'text-success',
    },
    error: {
      icon: 'bi-exclamation-circle-fill',
      title: 'Ocurrió un error',
      headerClassName: 'bg-danger-subtle text-danger-emphasis',
      iconClassName: 'text-danger',
    },
    warning: {
      icon: 'bi-exclamation-triangle-fill',
      title: 'Atención',
      headerClassName: 'bg-warning-subtle text-warning-emphasis',
      iconClassName: 'text-warning',
    },
    info: {
      icon: 'bi-info-circle-fill',
      title: 'Información',
      headerClassName: 'bg-info-subtle text-info-emphasis',
      iconClassName: 'text-info',
    },
  };

  return toastConfig[type];
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <aside className="app-toast-container" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((toast) => {
        const visualConfig = getToastVisualConfig(toast.type);

        return (
          <article
            key={toast.id}
            className="toast show app-toast border-0 shadow-lg"
            role={toast.type === 'error' ? 'alert' : 'status'}
          >
            <header className={`toast-header app-toast-header ${visualConfig.headerClassName}`}>
              <i
                className={`bi ${visualConfig.icon} ${visualConfig.iconClassName} me-2 fs-5`}
                aria-hidden="true"
              />

              <strong className="me-auto">{visualConfig.title}</strong>

              <button
                type="button"
                className="btn-close ms-2"
                aria-label="Cerrar notificación"
                onClick={() => onClose(toast.id)}
              />
            </header>

            <div className="toast-body app-toast-body">
              <p className="mb-0">{toast.message}</p>
            </div>
          </article>
        );
      })}
    </aside>
  );
}
