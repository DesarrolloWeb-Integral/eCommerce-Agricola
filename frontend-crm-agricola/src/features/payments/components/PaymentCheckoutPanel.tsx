import { useState } from 'react';

import { usePaymentSummary, useStartPaymentCheckout } from '../hooks';

interface PaymentCheckoutPanelProps {
  orderId: string;
  onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function PaymentCheckoutPanel({ orderId, onClose }: PaymentCheckoutPanelProps) {
  const { summary, isLoading, error: summaryError, reloadSummary } = usePaymentSummary(orderId);
  const {
    isStartingCheckout,
    error: checkoutError,
    startCheckout,
    resetError: resetCheckoutError,
  } = useStartPaymentCheckout();
  const [consentState, setConsentState] = useState<{
    orderId: string;
    isAccepted: boolean;
  }>({
    orderId: '',
    isAccepted: false,
  });
  const hasAcceptedConsent = consentState.orderId === orderId && consentState.isAccepted;

  async function handleStartCheckout(): Promise<void> {
    if (!hasAcceptedConsent) {
      return;
    }

    try {
      const checkout = await startCheckout(orderId, hasAcceptedConsent);
      window.location.assign(checkout.checkoutUrl);
    } catch {
      // El mensaje de error se muestra mediante checkoutError.
    }
  }

  const isButtonDisabled = isLoading || !summary || !hasAcceptedConsent || isStartingCheckout;

  return (
    <div className="d-grid gap-4">
      <div className="alert alert-success d-flex gap-3 mb-0" role="status">
        <i className="bi bi-shield-lock-fill fs-5" aria-hidden="true" />
        <div>
          <p className="fw-semibold mb-1">Pago seguro con Mercado Pago</p>
          <p className="mb-0">
            Revisaras el resumen aqui y despues continuaras al checkout protegido de Mercado Pago.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="card border-0 bg-light rounded-4">
          <div className="card-body text-center py-4">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Cargando resumen de pago...</span>
            </div>
            <p className="text-secondary mb-0">Cargando resumen de pago...</p>
          </div>
        </div>
      )}

      {!isLoading && summaryError && (
        <div className="alert alert-danger d-flex flex-column flex-sm-row gap-3 mb-0" role="alert">
          <div className="d-flex gap-2">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>{summaryError}</span>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-sm-auto"
            onClick={() => void reloadSummary()}
          >
            <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !summaryError && summary && (
        <section className="card border rounded-4 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-receipt-cutoff text-success fs-4" aria-hidden="true" />
              <h3 className="h5 fw-bold mb-0">Resumen del pago</h3>
            </div>

            <div className="list-group list-group-flush mb-3">
              <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                <span className="text-secondary">Subtotal del pedido</span>
                <span className="fw-semibold text-end">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                <span className="text-secondary">Comision de plataforma</span>
                <span className="fw-semibold text-end">{formatCurrency(summary.comision)}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                <span className="text-secondary">Monto para productor</span>
                <span className="fw-semibold text-end">
                  {formatCurrency(summary.montoProductor)}
                </span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                <span className="fw-bold">Total que pagara el cliente</span>
                <span className="fw-bold text-success fs-5 text-end">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>

            <p className="text-secondary small mb-0">
              El frontend no procesa tarjetas. La captura del pago ocurre directamente en Mercado
              Pago.
            </p>
          </div>
        </section>
      )}

      {checkoutError && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
          <i className="bi bi-info-circle-fill" aria-hidden="true" />
          <span>{checkoutError}</span>
        </div>
      )}

      <div className="form-check border rounded-4 p-3 ps-5 bg-light">
        <input
          className="form-check-input"
          type="checkbox"
          id={`payment-consent-${orderId}`}
          checked={hasAcceptedConsent}
          disabled={isLoading || isStartingCheckout || Boolean(summaryError)}
          onChange={(event) => {
            setConsentState({
              orderId,
              isAccepted: event.target.checked,
            });
            resetCheckoutError();
          }}
        />
        <label className="form-check-label" htmlFor={`payment-consent-${orderId}`}>
          Acepto que los datos minimos necesarios del pago sean enviados a Mercado Pago para
          completar esta operacion.
        </label>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={isStartingCheckout}
        >
          Cerrar
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => void handleStartCheckout()}
          disabled={isButtonDisabled}
        >
          {isStartingCheckout ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              Creando checkout...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-up-right me-2" aria-hidden="true" />
              Continuar a Mercado Pago
            </>
          )}
        </button>
      </div>
    </div>
  );
}
