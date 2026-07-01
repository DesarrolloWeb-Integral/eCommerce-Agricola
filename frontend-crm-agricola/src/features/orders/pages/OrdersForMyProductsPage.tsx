import { OrderStatusBadge } from '../components';
import { useOrdersForMyProducts } from '../hooks';
import type { OrderStatus } from '../types';

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

function getPaymentStatusInfo(status: OrderStatus): {
  className: string;
  icon: string;
  message: string;
} | null {
  if (status === 'PENDIENTE') {
    return {
      className: 'alert-warning',
      icon: 'bi-hourglass-split',
      message: 'En espera de pago del cliente.',
    };
  }

  if (status === 'CONFIRMADO') {
    return {
      className: 'alert-success',
      icon: 'bi-check2-circle',
      message: 'Pago aprobado. Pedido listo para preparar.',
    };
  }

  return null;
}

export function OrdersForMyProductsPage() {
  const { orders, isLoading, error, reloadOrders } = useOrdersForMyProducts();

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
                <i className="bi bi-clipboard-check fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Pedidos de clientes
                </p>

                <h1 className="h2 fw-bold mb-2">Pedidos recibidos</h1>

                <p className="text-secondary mb-0">
                  Los pedidos se confirman automaticamente cuando Mercado Pago aprueba el pago del
                  cliente.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => void reloadOrders()}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
              Actualizar pedidos
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          <span>{error}</span>
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
              <i className="bi bi-inbox fs-2" />
            </div>

            <h2 className="h4 fw-bold mb-2">Aun no tienes pedidos sobre tus productos</h2>
            <p className="text-secondary mb-0">
              Cuando un cliente cree un pedido, aparecera en esta seccion.
            </p>
          </div>
        </section>
      ) : (
        !error &&
        orders.length > 0 && (
          <section className="row g-4" aria-label="Pedidos recibidos">
            {orders.map((order) => {
              const statusInfo = getPaymentStatusInfo(order.estado);

              return (
                <div className="col-12" key={order.id}>
                  <article className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white border-0 p-4">
                      <div className="d-flex flex-column flex-lg-row gap-3">
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <h2 className="h5 fw-bold mb-0">Pedido {order.id}</h2>
                            <OrderStatusBadge status={order.estado} />
                          </div>

                          <div className="d-flex flex-wrap gap-3 text-secondary small">
                            <span>
                              <i className="bi bi-person me-1 text-success" aria-hidden="true" />
                              Cliente {order.clientId}
                            </span>
                            <span>
                              <i className="bi bi-calendar3 me-1 text-success" aria-hidden="true" />
                              {formatOrderDate(order.createdAt)}
                            </span>
                            <span>
                              <i className="bi bi-cash-coin me-1 text-success" aria-hidden="true" />
                              {formatCurrency(order.subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {statusInfo && (
                        <div
                          className={`alert ${statusInfo.className} d-inline-flex align-items-center gap-2 py-2 px-3 small mb-0 mt-3`}
                          role="status"
                        >
                          <i className={`bi ${statusInfo.icon}`} aria-hidden="true" />
                          <span>{statusInfo.message}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-body p-4">
                      <h3 className="h6 fw-bold mb-3">Productos solicitados</h3>

                      <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Producto</th>
                              <th scope="col">Cantidad solicitada</th>
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
                  </article>
                </div>
              );
            })}
          </section>
        )
      )}
    </main>
  );
}
