import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCancelOrder, useMyOrders } from '../hooks';
import type { Order } from '../types';

interface OrdersByProducer {
  producerProfileId: string;
  orders: Order[];
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
    <main>
      <h1>Mis pedidos</h1>

      <button
        type="button"
        onClick={() => navigate('/dashboard/cliente/pedidos/nuevo')}
        disabled={isLoading || isCancelling}
      >
        Crear pedido
      </button>

      <button
        type="button"
        onClick={() => void reloadOrders()}
        disabled={isLoading || isCancelling}
      >
        Actualizar pedidos
      </button>

      {isLoading && <p>Cargando pedidos...</p>}

      {!isLoading && error && <p>{error}</p>}

      {!isLoading && cancelError && <p>{cancelError}</p>}

      {!isLoading && !error && orders.length === 0 && <p>Aún no has realizado pedidos.</p>}

      {!isLoading && !error && ordersByProducer.length > 0 && (
        <section>
          {ordersByProducer.map((group) => (
            <section key={group.producerProfileId}>
              <h2>Productor {group.producerProfileId.slice(0, 8)}</h2>

              {group.orders.map((order) => (
                <article key={order.id}>
                  <h3>Pedido {order.id}</h3>

                  <p>Estado: {order.estado}</p>
                  <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                  <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>

                  {order.estado === 'PENDIENTE' && (
                    <button
                      type="button"
                      onClick={() => void handleCancelOrder(order.id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelando pedido...' : 'Cancelar pedido'}
                    </button>
                  )}

                  <h4>Productos</h4>

                  <ul>
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        <p>Producto: {item.productId}</p>
                        <p>Cantidad: {item.quantity}</p>
                        <p>Precio unitario: ${item.unitPrice.toFixed(2)}</p>
                        <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          ))}
        </section>
      )}
    </main>
  );
}
