import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductCatalogCard } from '../components/ProductCatalogCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import {
  buscarProductos,
  getProductoDetalle,
  getProductosDisponibles,
  getProductosPorCategoria,
} from '../services/producto.service';
import type { CategoriaProducto, Producto, ProductoDetalle } from '../types/producto.types';
import { CATEGORIA_LABELS, CATEGORIAS } from '../types/producto.types';
import { useCart } from '../../orders/hooks';

export function CatalogoProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaProducto | null>(null);
  const [detalle, setDetalle] = useState<ProductoDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const { addItem, summary } = useCart();

  useEffect(() => {
    const delay = busqueda.trim().length >= 2 ? 400 : 0;
    let cancelled = false;

    const timer = setTimeout(() => {
      const fetchData =
        busqueda.trim().length >= 2
          ? buscarProductos(busqueda.trim())
          : categoriaActiva
            ? getProductosPorCategoria(categoriaActiva)
            : getProductosDisponibles();

      fetchData
        .then((data) => {
          if (!cancelled) {
            setProductos(data);
            setIsLoading(false);
            setError(null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError('No se pudieron cargar los productos.');
            setIsLoading(false);
          }
        });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [busqueda, categoriaActiva]);

  async function verDetalle(id: string) {
    setLoadingDetalle(true);
    setDetalle(null);
    try {
      const data = await getProductoDetalle(id);
      setDetalle(data);
    } catch {
      setError('No se pudo cargar el detalle del producto.');
    } finally {
      setLoadingDetalle(false);
    }
  }

  function handleCategoria(cat: CategoriaProducto) {
    setBusqueda('');
    setCategoriaActiva((prev) => (prev === cat ? null : cat));
  }

  function getCantidad(producto: Producto): number {
    return cantidades[producto.id] ?? 1;
  }

  function handleCantidadChange(producto: Producto, value: number): void {
    const maxQuantity = Math.max(producto.cantidad, 1);
    const nextQuantity = Number.isInteger(value) ? value : 1;
    const safeQuantity = Math.min(Math.max(nextQuantity, 1), maxQuantity);

    setCantidades((current) => ({
      ...current,
      [producto.id]: safeQuantity,
    }));
  }

  function handleAddToCart(producto: Producto, producerName?: string): void {
    addItem(
      {
        productId: producto.id,
        producerProfileId: producto.producerProfileId,
        producerName,
        name: producto.nombre,
        category: producto.categoria,
        unitPrice: producto.precio,
        availableQuantity: producto.cantidad,
      },
      getCantidad(producto)
    );

    setCartMessage(`${producto.nombre} agregado al carrito.`);
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
                <i className="bi bi-bag-check fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Catálogo agrícola
                </p>

                <h1 className="h2 fw-bold mb-2">Productos disponibles</h1>

                <p className="text-secondary mb-0">
                  Busca productos, filtra por categoría y agrega al carrito lo que necesites.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard/cliente')}
              >
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Volver
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate('/dashboard/cliente/pedidos/nuevo')}
              >
                <i className="bi bi-cart3 me-2" aria-hidden="true" />
                Carrito
                {summary.totalItems > 0 && (
                  <span className="badge text-bg-light ms-2">{summary.totalItems}</span>
                )}
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

      {cartMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check2-circle" aria-hidden="true" />
          <span>{cartMessage}</span>
        </div>
      )}

      <section className="bg-white border rounded-4 shadow-sm p-4 mb-4" aria-label="Filtros">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg">
            <label htmlFor="product-search" className="form-label fw-semibold">
              Buscar productos
            </label>

            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-success" aria-hidden="true" />
              </span>

              <input
                id="product-search"
                type="search"
                className="form-control"
                placeholder="Buscar productos por nombre..."
                value={busqueda}
                onChange={(event) => {
                  setBusqueda(event.target.value);
                  setCategoriaActiva(null);
                }}
                maxLength={100}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${
                    categoriaActiva === cat ? 'btn-success' : 'btn-outline-success'
                  }`}
                  onClick={() => handleCategoria(cat)}
                >
                  <i className="bi bi-tag me-2" aria-hidden="true" />
                  {CATEGORIA_LABELS[cat]}
                </button>
              ))}

              {categoriaActiva && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCategoriaActiva(null)}
                >
                  <i className="bi bi-x-lg me-2" aria-hidden="true" />
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {(detalle || loadingDetalle) && (
        <ProductDetailModal
          detalle={detalle}
          isLoading={loadingDetalle}
          onClose={() => setDetalle(null)}
          onViewProducer={(producerId) => navigate(`/productores/${producerId}`)}
        />
      )}

      {isLoading ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </div>
            <p className="text-secondary mb-0">Cargando productos...</p>
          </div>
        </div>
      ) : productos.length === 0 ? (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center p-4 p-lg-5">
            <div
              className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '4rem', height: '4rem' }}
              aria-hidden="true"
            >
              <i className="bi bi-search fs-2" />
            </div>

            <h2 className="h4 fw-bold mb-2">No se encontraron productos</h2>
            <p className="text-secondary mb-4">
              Intenta con otro término de búsqueda o limpia los filtros.
            </p>

            {(busqueda || categoriaActiva) && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setBusqueda('');
                  setCategoriaActiva(null);
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true" />
                Ver todos los productos
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="row g-4" aria-label="Productos disponibles">
          {productos.map((producto) => (
            <div key={producto.id} className="col-12 col-md-6 col-xl-4">
              <ProductCatalogCard
                producto={producto}
                quantity={getCantidad(producto)}
                onAddToCart={handleAddToCart}
                onQuantityChange={handleCantidadChange}
                onViewDetail={(id) => void verDetalle(id)}
              />
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
