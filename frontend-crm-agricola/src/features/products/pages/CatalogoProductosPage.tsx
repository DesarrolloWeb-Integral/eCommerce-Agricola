import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProductosDisponibles,
  buscarProductos,
  getProductosPorCategoria,
  getProductoDetalle,
} from '../services/producto.service';
import type { Producto, ProductoDetalle, CategoriaProducto } from '../types/producto.types';
import { CATEGORIAS, CATEGORIA_LABELS } from '../types/producto.types';

export function CatalogoProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaProducto | null>(null);
  const [detalle, setDetalle] = useState<ProductoDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/dashboard/cliente')}
        >
          ← Volver
        </button>
        <h2 className="mb-0">Catálogo de productos agrícolas</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar productos por nombre…"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setCategoriaActiva(null);
          }}
          maxLength={100}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${categoriaActiva === cat ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => handleCategoria(cat)}
          >
            {CATEGORIA_LABELS[cat]}
          </button>
        ))}
        {categoriaActiva && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCategoriaActiva(null)}
          >
            ✕ Limpiar filtro
          </button>
        )}
      </div>

      {(detalle || loadingDetalle) && (
        <div
          className="modal d-block"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setDetalle(null)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{detalle?.nombre ?? 'Cargando…'}</h5>
                <button className="btn-close" onClick={() => setDetalle(null)} />
              </div>
              <div className="modal-body">
                {loadingDetalle ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" />
                  </div>
                ) : (
                  detalle && (
                    <div className="row g-4">
                      <div className="col-md-7">
                        <span className="badge bg-secondary mb-2">
                          {CATEGORIA_LABELS[detalle.categoria]}
                        </span>
                        <p className="text-muted">{detalle.descripcion}</p>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <th>Precio</th>
                              <td className="fw-bold text-success">${detalle.precio.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <th>Cantidad disponible</th>
                              <td>{detalle.cantidad} unidades</td>
                            </tr>
                            <tr>
                              <th>Disponible</th>
                              <td>
                                <span
                                  className={`badge ${detalle.disponible ? 'bg-success' : 'bg-danger'}`}
                                >
                                  {detalle.disponible ? 'Sí' : 'No'}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-5">
                        <div className="card bg-light p-3">
                          <h6 className="fw-bold mb-2">🌾 Productor</h6>
                          <p className="mb-1 fw-semibold">{detalle.productor.businessName}</p>
                          {detalle.productor.generalLocation && (
                            <p className="mb-1 text-muted small">
                              📍 {detalle.productor.generalLocation}
                            </p>
                          )}
                          {detalle.productor.contactPhone && (
                            <p className="mb-1 small">📞 {detalle.productor.contactPhone}</p>
                          )}
                          {detalle.productor.contactEmail && (
                            <p className="mb-1 small">✉️ {detalle.productor.contactEmail}</p>
                          )}
                          <button
                            className="btn btn-outline-success btn-sm mt-2"
                            onClick={() => navigate(`/productores/${detalle.productor.id}`)}
                          >
                            Ver perfil del productor
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No se encontraron productos.</p>
          {(busqueda || categoriaActiva) && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva(null);
              }}
            >
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {productos.map((p) => (
            <div key={p.id} className="col-sm-6 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary mb-2 align-self-start">
                    {CATEGORIA_LABELS[p.categoria]}
                  </span>
                  <h6 className="card-title fw-bold">{p.nombre}</h6>
                  <p
                    className="card-text text-muted small flex-grow-1"
                    style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {p.descripcion}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fs-5 fw-bold text-success">${p.precio.toFixed(2)}</span>
                    <span className="text-muted small">{p.cantidad} uds.</span>
                  </div>
                  <button
                    className="btn btn-outline-success btn-sm mt-3"
                    onClick={() => verDetalle(p.id)}
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
