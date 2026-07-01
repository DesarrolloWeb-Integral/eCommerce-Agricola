import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartProducerOrderCard } from '../components';
import { useCart, useCreateOrder } from '../hooks';
import type { CartProducerGroup } from '../types';

function getProducerLabel(group: CartProducerGroup): string {
  return group.producerName ?? `Productor ${group.producerProfileId.slice(0, 8)}`;
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function CreateOrderPage() {
  const navigate = useNavigate();
  const { groups, summary, updateQuantity, removeItem, clearProducerGroup, clearCart } = useCart();
  const { isCreating, error: createError, createClientOrder } = useCreateOrder();
  const [creatingProducerId, setCreatingProducerId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleCreateOrder(group: CartProducerGroup): Promise<void> {
    setSuccessMessage(null);
    setCreatingProducerId(group.producerProfileId);

    try {
      await createClientOrder({
        items: group.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clearProducerGroup(group.producerProfileId);
      setSuccessMessage(`Pedido creado para ${getProducerLabel(group)}.`);
    } catch {
      // El mensaje se muestra mediante createError.
    } finally {
      setCreatingProducerId(null);
    }
  }

  function handleClearCart(): void {
    const shouldClear = window.confirm('¿Deseas vaciar el carrito?');

    if (shouldClear) {
      clearCart();
      setSuccessMessage(null);
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
                <i className="bi bi-cart3 fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Carrito de compra
                </p>

                <h1 className="h2 fw-bold mb-2">Crear pedido</h1>

                <p className="text-secondary mb-0">
                  Revisa tus productos por productor antes de generar cada pedido.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard/cliente/productos')}
              >
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Catálogo
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => navigate('/dashboard/cliente/pedidos')}
              >
                <i className="bi bi-receipt me-2" aria-hidden="true" />
                Mis pedidos
              </button>
            </div>
          </div>
        </div>
      </section>

      {successMessage && (
        <div
          className="alert alert-success d-flex flex-column flex-md-row align-items-md-center gap-3"
          role="alert"
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check2-circle" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>

          <button
            type="button"
            className="btn btn-success btn-sm ms-md-auto"
            onClick={() => navigate('/dashboard/cliente/pedidos')}
          >
            <i className="bi bi-credit-card me-2" aria-hidden="true" />
            Ir a pagar pedido
          </button>
        </div>
      )}

      {createError && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          <span>{createError}</span>
        </div>
      )}

      {groups.length === 0 ? (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center p-4 p-lg-5">
            <div
              className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '4rem', height: '4rem' }}
              aria-hidden="true"
            >
              <i className="bi bi-cart-x fs-2" />
            </div>

            <h2 className="h4 fw-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-secondary mb-4">
              Agrega productos desde el catálogo para preparar un pedido.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate('/dashboard/cliente/productos')}
              >
                <i className="bi bi-basket me-2" aria-hidden="true" />
                Ver productos
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => navigate('/dashboard/cliente/pedidos')}
              >
                <i className="bi bi-receipt me-2" aria-hidden="true" />
                Ver mis pedidos
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-white border rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
              <div className="d-flex flex-wrap gap-2">
                <span className="badge text-bg-success">
                  {summary.totalItems} producto
                  {summary.totalItems !== 1 ? 's' : ''}
                </span>
                <span className="badge text-bg-secondary">
                  {summary.totalGroups} productor
                  {summary.totalGroups !== 1 ? 'es' : ''}
                </span>
              </div>

              <p className="fw-bold text-success mb-0 ms-lg-auto">
                Total: {formatCurrency(summary.subtotal)}
              </p>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                disabled={isCreating}
                onClick={handleClearCart}
              >
                <i className="bi bi-trash me-2" aria-hidden="true" />
                Vaciar carrito
              </button>
            </div>
          </section>

          <div className="d-grid gap-4">
            {groups.map((group) => (
              <CartProducerOrderCard
                key={group.producerProfileId}
                group={group}
                producerLabel={getProducerLabel(group)}
                isCreating={isCreating}
                isGroupCreating={creatingProducerId === group.producerProfileId}
                onCreateOrder={(nextGroup) => void handleCreateOrder(nextGroup)}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
