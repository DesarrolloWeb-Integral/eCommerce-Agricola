import type { CartProducerGroup } from '../types';

interface CartProducerOrderCardProps {
  group: CartProducerGroup;
  isCreating: boolean;
  isGroupCreating: boolean;
  producerLabel: string;
  onCreateOrder: (group: CartProducerGroup) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartProducerOrderCard({
  group,
  isCreating,
  isGroupCreating,
  producerLabel,
  onCreateOrder,
  onRemoveItem,
  onUpdateQuantity,
}: CartProducerOrderCardProps) {
  return (
    <section className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-header bg-white border-0 p-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">Productor</p>
            <h2 className="h5 fw-bold mb-0">{producerLabel}</h2>
          </div>

          <div className="ms-sm-auto text-sm-end">
            <span className="badge text-bg-light border text-secondary mb-2">
              {group.totalItems} producto
              {group.totalItems !== 1 ? 's' : ''}
            </span>
            <p className="fw-bold text-success mb-0">${group.subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="list-group list-group-flush">
        {group.items.map((item) => (
          <div key={item.productId} className="list-group-item p-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-lg">
                <h3 className="h6 fw-bold mb-1">{item.name}</h3>
                <div className="d-flex flex-wrap gap-3 text-secondary small">
                  <span>
                    <i className="bi bi-tag text-success me-1" aria-hidden="true" />$
                    {item.unitPrice.toFixed(2)} por unidad
                  </span>
                  <span>
                    <i className="bi bi-calculator text-success me-1" aria-hidden="true" />
                    Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="col-12 col-lg-auto">
                <div className="d-flex align-items-center gap-2">
                  <div className="input-group input-group-sm" style={{ width: 150 }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={isCreating || item.quantity <= 1}
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Reducir cantidad"
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
                        onUpdateQuantity(item.productId, Number(event.target.value))
                      }
                      aria-label={`Cantidad de ${item.name}`}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={isCreating || item.quantity >= item.availableQuantity}
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <i className="bi bi-plus" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={isCreating}
                    onClick={() => onRemoveItem(item.productId)}
                    aria-label={`Quitar ${item.name}`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer bg-white border-0 p-4 d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-success"
          disabled={isCreating}
          onClick={() => onCreateOrder(group)}
        >
          {isGroupCreating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
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
}
