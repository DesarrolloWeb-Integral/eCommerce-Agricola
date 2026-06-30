import { OrderStatusBadge } from '../components';
import { useConfirmOrder, useOrdersForMyProducts } from '../hooks';

function formatOrderDate(value: string): string {
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function OrdersForMyProductsPage() {
  const { orders, isLoading, error, reloadOrders } = useOrdersForMyProducts();
  const { isConfirming, error: confirmError, confirmProviderOrder } = useConfirmOrder();

  async function handleConfirmOrder(orderId: string): Promise<void> {
    const shouldConfirm = window.confirm('¿Estás seguro de que deseas confirmar este pedido?');

    if (!shouldConfirm) {
      return;
    }

    try {
      await confirmProviderOrder(orderId);
      await reloadOrders();
    } catch {
      // El mensaje de error se muestra mediante confirmError.
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
                <i className="bi bi-clipboard-check fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Pedidos de clientes
                </p>

                <h1 className="h2 fw-bold mb-2">Pedidos recibidos</h1>

                <p className="text-secondary mb-0">
                  Revisa las solicitudes sobre tus productos y confirma los pedidos pendientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => void reloadOrders()}
              disabled={isLoading || isConfirming}
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

      {confirmError && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-info-circle-fill" aria-hidden="true" />
          <span>{confirmError}</span>
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

            <h2 className="h4 fw-bold mb-2">Aún no tienes pedidos sobre tus productos</h2>
            <p className="text-secondary mb-0">
              Cuando un cliente cree un pedido, aparecerá en esta sección.
            </p>
          </div>
        </section>
      ) : (
        !error &&
        orders.length > 0 && (
          <section className="row g-4" aria-label="Pedidos recibidos">
            {orders.map((order) => (
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
                            <i className="bi bi-cash-coin me-1 text-success" aria-hidden="true" />$
                            {order.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {order.estado === 'PENDIENTE' && (
                        <div className="align-self-lg-start">
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => void handleConfirmOrder(order.id)}
                            disabled={isConfirming}
                          >
                            {isConfirming ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  aria-hidden="true"
                                />
                                Confirmando...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                                Confirmar pedido
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
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
                              <td>${item.unitPrice.toFixed(2)}</td>
                              <td className="fw-semibold">${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </section>
        )
      )}
    </main>
  );
}
