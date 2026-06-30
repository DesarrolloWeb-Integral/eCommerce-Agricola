import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function MyOrdersPage() {
  const { orders, isLoading, error, reloadOrders } = useMyOrders();
  const { isCancelling, error: cancelError, cancelClientOrder } = useCancelOrder();

  const navigate = useNavigate();
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
                              <i className="bi bi-calendar3 me-1 text-success" aria-hidden="true" />
                              {formatOrderDate(order.createdAt)}
                            </span>
                            <span>
                              <i className="bi bi-cash-coin me-1 text-success" aria-hidden="true" />
                              ${order.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {order.estado === 'PENDIENTE' && (
                          <div className="align-self-lg-start">
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
                        )}
                      </div>

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
                                <td>${item.unitPrice.toFixed(2)}</td>
                                <td className="fw-semibold">${item.subtotal.toFixed(2)}</td>
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
  );
}
