import { useConfirmOrder, useOrdersForMyProducts } from '../hooks';

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
    <main>
      <h1>Pedidos recibidos</h1>

      <button
        type="button"
        onClick={() => void reloadOrders()}
        disabled={isLoading || isConfirming}
      >
        Actualizar pedidos
      </button>

      {isLoading && <p>Cargando pedidos...</p>}

      {!isLoading && error && <p>{error}</p>}

      {!isLoading && confirmError && <p>{confirmError}</p>}

      {!isLoading && !error && orders.length === 0 && (
        <p>Aún no tienes pedidos sobre tus productos.</p>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <section>
          {orders.map((order) => (
            <article key={order.id}>
              <h2>Pedido {order.id}</h2>

              <p>Cliente: {order.clientId}</p>
              <p>Estado: {order.estado}</p>
              <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
              <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>

              {order.estado === 'PENDIENTE' && (
                <button
                  type="button"
                  onClick={() => void handleConfirmOrder(order.id)}
                  disabled={isConfirming}
                >
                  {isConfirming ? 'Confirmando pedido...' : 'Confirmar pedido'}
                </button>
              )}

              <h3>Productos solicitados</h3>

              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    <p>Producto: {item.productId}</p>
                    <p>Cantidad solicitada: {item.quantity}</p>
                    <p>Precio unitario: ${item.unitPrice.toFixed(2)}</p>
                    <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
