import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PaymentCheckoutPanel } from '../../payments';
import { OrderStatusBadge } from '../components';
import { useCancelOrder, useMyOrders } from '../hooks';
import type { Order } from '../types';

interface OrdersByProducer {
  producerProfileId: string;
  orders: Order[];
}

function formatOrderDate(value: string): string {
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function getPaymentReturnAlert(status: string | null): {
  className: string;
  icon: string;
  title: string;
  message: string;
} | null {
  if (!status) {
    return null;
  }

  if (status === 'approved') {
    return {
      className: 'alert-success',
      icon: 'bi-check2-circle',
      title: 'Pago acreditado en Mercado Pago',
      message:
        'Estamos actualizando tus pedidos. Si aun aparece pendiente, espera unos segundos y presiona Actualizar.',
    };
  }

  if (status === 'pending' || status === 'in_process') {
    return {
      className: 'alert-warning',
      icon: 'bi-hourglass-split',
      title: 'Pago en proceso',
      message:
        'Mercado Pago todavia esta procesando el pago. Puedes volver a actualizar esta pantalla en unos momentos.',
    };
  }

  if (status === 'rejected' || status === 'failure' || status === 'cancelled') {
    return {
      className: 'alert-danger',
      icon: 'bi-x-circle',
      title: 'Pago no aprobado',
      message: 'Mercado Pago no aprobo el pago. El pedido seguira pendiente si aun puedes pagarlo.',
    };
  }

  return {
    className: 'alert-info',
    icon: 'bi-info-circle',
    title: 'Regresaste desde Mercado Pago',
    message: 'Actualiza tus pedidos para revisar el estado mas reciente del pago.',
  };
}

export function MyOrdersPage() {
  const { orders, isLoading, error, reloadOrders } = useMyOrders();
  const { isCancelling, error: cancelError, cancelClientOrder } = useCancelOrder();
  const [activePaymentOrderId, setActivePaymentOrderId] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentReturnStatus = searchParams.get('status') ?? searchParams.get('collection_status');
  const paymentReturnAlert = useMemo(
    () => getPaymentReturnAlert(paymentReturnStatus),
    [paymentReturnStatus]
  );
  const ordersByProducer = useMemo<OrdersByProducer[]>(() => {
    const groups = new Map<string, Order[]>();

    for (const order of orders) {
      const currentOrders = groups.get(order.producerProfileId) ?? [];
      groups.set(order.producerProfileId, [...currentOrders, order]);
    }

    return Array.from(groups.entries()).map(([producerProfileId, producerOrders]) => ({
      producerProfileId,
      orders: producerOrders,
    }));
  }, [orders]);

  const activePaymentOrder = useMemo(
    () => orders.find((order) => order.id === activePaymentOrderId) ?? null,
    [activePaymentOrderId, orders]
  );

  function handleClosePaymentModal(): void {
    setActivePaymentOrderId(null);
  }

  useEffect(() => {
    if (paymentReturnStatus) {
      void reloadOrders();
    }
  }, [paymentReturnStatus, reloadOrders]);

  async function handleCancelOrder(orderId: string): Promise<void> {
    const shouldCancel = window.confirm('¿Estás seguro de que deseas cancelar este pedido?');

    if (!shouldCancel) {
      return;
    }

    try {
      await cancelClientOrder(orderId);
      await reloadOrders();
    } catch {
      // El mensaje de error se muestra mediante cancelError.
    }
  }

  return (
    <>
      <main className="container-xxl">
        <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '3.75rem', height: '3.75rem' }}
                  aria-hidden="true"
                >
                  <i className="bi bi-receipt fs-3" />
                </div>

                <div>
                  <p className="text-uppercase text-success fw-semibold small mb-1">
                    Historial de compras
                  </p>

                  <h1 className="h2 fw-bold mb-2">Mis pedidos</h1>

                  <p className="text-secondary mb-0">
                    Consulta tus pedidos, revisa sus productos y cancela los que sigan pendientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-auto">
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => navigate('/dashboard/cliente/pedidos/nuevo')}
                  disabled={isLoading || isCancelling}
                >
                  <i className="bi bi-cart-plus me-2" aria-hidden="true" />
                  Crear pedido
                </button>

                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => void reloadOrders()}
                  disabled={isLoading || isCancelling}
                >
                  <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {cancelError && (
          <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-info-circle-fill" aria-hidden="true" />
            <span>{cancelError}</span>
          </div>
        )}

        {paymentReturnAlert && (
          <div
            className={`alert ${paymentReturnAlert.className} d-flex flex-column flex-md-row align-items-md-center gap-3`}
            role="status"
          >
            <div className="d-flex gap-2">
              <i className={`bi ${paymentReturnAlert.icon}`} aria-hidden="true" />
              <div>
                <p className="fw-semibold mb-1">{paymentReturnAlert.title}</p>
                <p className="mb-0">{paymentReturnAlert.message}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-success btn-sm ms-md-auto"
              onClick={() => void reloadOrders()}
              disabled={isLoading || isCancelling}
            >
              <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
              Actualizar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-success mb-3" role="status">
                <span className="visually-hidden">Cargando pedidos...</span>
              </div>
              <p className="text-secondary mb-0">Cargando pedidos...</p>
            </div>
          </div>
        ) : !error && orders.length === 0 ? (
          <section className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center p-4 p-lg-5">
              <div
                className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '4rem', height: '4rem' }}
                aria-hidden="true"
              >
                <i className="bi bi-bag-check fs-2" />
              </div>

              <h2 className="h4 fw-bold mb-2">Aún no has realizado pedidos</h2>
              <p className="text-secondary mb-4">
                Explora el catálogo y agrega productos a tu carrito para crear tu primer pedido.
              </p>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate('/dashboard/cliente/productos')}
              >
                <i className="bi bi-grid me-2" aria-hidden="true" />
                Ver catálogo
              </button>
            </div>
          </section>
        ) : (
          !error &&
          ordersByProducer.length > 0 && (
            <section className="d-grid gap-4" aria-label="Pedidos agrupados por productor">
              {ordersByProducer.map((group) => (
                <article
                  key={group.producerProfileId}
                  className="card border-0 shadow-sm rounded-4 overflow-hidden"
                >
                  <div className="card-header bg-white border-0 p-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                      <div>
                        <p className="text-uppercase text-success fw-semibold small mb-1">
                          Productor
                        </p>
                        <h2 className="h5 fw-bold mb-0">
                          Productor {group.producerProfileId.slice(0, 8)}
                        </h2>
                      </div>

                      <span className="badge text-bg-light border text-secondary ms-md-auto">
                        {group.orders.length} pedido
                        {group.orders.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="list-group list-group-flush">
                    {group.orders.map((order) => (
                      <div key={order.id} className="list-group-item p-4">
                        <div className="d-flex flex-column flex-lg-row gap-3 mb-3">
                          <div className="flex-grow-1">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                              <h3 className="h6 fw-bold mb-0">Pedido {order.id}</h3>
                              <OrderStatusBadge status={order.estado} />
                            </div>

                            <div className="d-flex flex-wrap gap-3 text-secondary small">
                              <span>
                                <i
                                  className="bi bi-calendar3 me-1 text-success"
                                  aria-hidden="true"
                                />
                                {formatOrderDate(order.createdAt)}
                              </span>
                              <span>
                                <i
                                  className="bi bi-cash-coin me-1 text-success"
                                  aria-hidden="true"
                                />
                                {formatCurrency(order.subtotal)}
                              </span>
                            </div>
                          </div>

                          {order.estado === 'PENDIENTE' && (
                            <div className="align-self-lg-start">
                              <div className="d-flex flex-column flex-sm-row flex-lg-column flex-xl-row gap-2">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => setActivePaymentOrderId(order.id)}
                                  disabled={isCancelling}
                                >
                                  <i className="bi bi-credit-card me-2" aria-hidden="true" />
                                  Pagar pedido
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => void handleCancelOrder(order.id)}
                                  disabled={isCancelling}
                                >
                                  {isCancelling ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-2"
                                        aria-hidden="true"
                                      />
                                      Cancelando...
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-x-circle me-2" aria-hidden="true" />
                                      Cancelar pedido
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {order.estado === 'CONFIRMADO' && (
                          <div
                            className="alert alert-success d-inline-flex align-items-center gap-2 py-2 px-3 small mb-3"
                            role="status"
                          >
                            <i className="bi bi-check2-circle" aria-hidden="true" />
                            <span>Pago aprobado. El productor puede preparar tu pedido.</span>
                          </div>
                        )}

                        <div className="table-responsive">
                          <table className="table table-sm align-middle mb-0">
                            <thead className="table-light">
                              <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio unitario</th>
                                <th scope="col">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item) => (
                                <tr key={item.productId}>
                                  <td className="fw-semibold">{item.productId}</td>
                                  <td>{item.quantity}</td>
                                  <td>{formatCurrency(item.unitPrice)}</td>
                                  <td className="fw-semibold">{formatCurrency(item.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          )
        )}
      </main>

      {activePaymentOrder?.estado === 'PENDIENTE' && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header border-0 pb-0">
                  <div>
                    <p className="text-uppercase text-success fw-semibold small mb-1">
                      Checkout Pro
                    </p>
                    <h2 className="modal-title h4 fw-bold" id="payment-modal-title">
                      Pagar pedido
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={handleClosePaymentModal}
                  />
                </div>
                <div className="modal-body p-4">
                  <PaymentCheckoutPanel
                    orderId={activePaymentOrder.id}
                    onClose={handleClosePaymentModal}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
}
