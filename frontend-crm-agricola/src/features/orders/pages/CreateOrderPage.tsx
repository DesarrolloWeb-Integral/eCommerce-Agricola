import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart, useCreateOrder } from '../hooks';
import type { CartProducerGroup } from '../types';

function getProducerLabel(group: CartProducerGroup): string {
  return group.producerName ?? `Productor ${group.producerProfileId.slice(0, 8)}`;
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
    <main className="container py-4" style={{ maxWidth: 980 }}>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/dashboard/cliente/productos')}
        >
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Catalogo
        </button>

        <h1 className="h3 mb-0">Carrito</h1>

        <button
          type="button"
          className="btn btn-outline-success btn-sm ms-auto"
          onClick={() => navigate('/dashboard/cliente/pedidos')}
        >
          <i className="bi bi-receipt me-2" aria-hidden="true" />
          Mis pedidos
        </button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {createError && <div className="alert alert-danger">{createError}</div>}

      {groups.length === 0 ? (
        <section className="text-center py-5">
          <h2 className="h5">Tu carrito esta vacio</h2>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-3">
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
        </section>
      ) : (
        <>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span className="badge text-bg-success">{summary.totalItems} productos</span>
            <span className="badge text-bg-secondary">{summary.totalGroups} productores</span>
            <span className="fw-semibold ms-sm-auto">Total: ${summary.subtotal.toFixed(2)}</span>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              disabled={isCreating}
              onClick={handleClearCart}
            >
              <i className="bi bi-trash me-2" aria-hidden="true" />
              Vaciar
            </button>
          </div>

          <div className="d-grid gap-3">
            {groups.map((group) => {
              const isGroupCreating = creatingProducerId === group.producerProfileId;

              return (
                <section key={group.producerProfileId} className="card shadow-sm">
                  <div className="card-header bg-white d-flex flex-wrap align-items-center gap-2">
                    <div>
                      <h2 className="h5 mb-0">{getProducerLabel(group)}</h2>
                      <small className="text-muted">{group.totalItems} productos</small>
                    </div>
                    <strong className="ms-sm-auto">${group.subtotal.toFixed(2)}</strong>
                  </div>

                  <div className="list-group list-group-flush">
                    {group.items.map((item) => (
                      <div
                        key={item.productId}
                        className="list-group-item d-flex flex-column flex-md-row gap-3"
                      >
                        <div className="flex-grow-1">
                          <h3 className="h6 mb-1">{item.name}</h3>
                          <p className="text-muted small mb-1">
                            ${item.unitPrice.toFixed(2)} por unidad
                          </p>
                          <p className="mb-0 small">
                            Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}
                          </p>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <div className="input-group input-group-sm" style={{ width: 150 }}>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              disabled={isCreating || item.quantity <= 1}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <i className="bi bi-dash" aria-hidden="true" />
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              min={1}
                              max={item.availableQuantity}
                              value={item.quantity}
                              disabled={isCreating}
                              onChange={(event) =>
                                updateQuantity(item.productId, Number(event.target.value))
                              }
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              disabled={isCreating || item.quantity >= item.availableQuantity}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <i className="bi bi-plus" aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={isCreating}
                            onClick={() => removeItem(item.productId)}
                          >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer bg-white d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={isCreating}
                      onClick={() => void handleCreateOrder(group)}
                    >
                      {isGroupCreating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                          Crear pedido
                        </>
                      )}
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
