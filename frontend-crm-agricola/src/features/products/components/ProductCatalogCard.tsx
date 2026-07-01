import type { Producto } from '../types/producto.types';
import { CATEGORIA_LABELS } from '../types/producto.types';

interface ProductCatalogCardProps {
  producto: Producto;
  quantity: number;
  onAddToCart: (producto: Producto) => void;
  onQuantityChange: (producto: Producto, value: number) => void;
  onViewDetail: (id: string) => void;
}

export function ProductCatalogCard({
  producto,
  quantity,
  onAddToCart,
  onQuantityChange,
  onViewDetail,
}: ProductCatalogCardProps) {
  const isUnavailable = !producto.disponible || producto.cantidad <= 0;

  return (
    <article className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <span className="badge text-bg-light border text-secondary">
            <i className="bi bi-tag text-success me-1" aria-hidden="true" />
            {CATEGORIA_LABELS[producto.categoria]}
          </span>

          <span className={`badge ${producto.disponible ? 'text-bg-success' : 'text-bg-danger'}`}>
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>

        <h3 className="h5 fw-bold mb-2">{producto.nombre}</h3>

        <p className="card-text text-secondary small flex-grow-1">{producto.descripcion}</p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-success">${producto.precio.toFixed(2)}</span>
          <span className="text-secondary small">{producto.cantidad} MXM.</span>
        </div>

        <div className="input-group input-group-sm mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isUnavailable || quantity <= 1}
            onClick={() => onQuantityChange(producto, quantity - 1)}
            aria-label="Reducir cantidad"
          >
            <i className="bi bi-dash" aria-hidden="true" />
          </button>

          <input
            type="number"
            className="form-control text-center"
            min={1}
            max={producto.cantidad}
            value={quantity}
            disabled={isUnavailable}
            onChange={(event) => onQuantityChange(producto, Number(event.target.value))}
            aria-label={`Cantidad de ${producto.nombre}`}
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isUnavailable || quantity >= producto.cantidad}
            onClick={() => onQuantityChange(producto, quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            <i className="bi bi-plus" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="btn btn-success btn-sm mt-3"
          disabled={isUnavailable}
          onClick={() => onAddToCart(producto)}
        >
          <i className="bi bi-cart-plus me-2" aria-hidden="true" />
          Agregar al carrito
        </button>

        <button
          type="button"
          className="btn btn-outline-success btn-sm mt-2"
          onClick={() => onViewDetail(producto.id)}
        >
          <i className="bi bi-eye me-2" aria-hidden="true" />
          Ver detalle
        </button>
      </div>
    </article>
  );
}
