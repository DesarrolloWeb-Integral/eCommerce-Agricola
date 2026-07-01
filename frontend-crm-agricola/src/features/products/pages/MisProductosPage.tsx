import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getOwnProducerProfile } from '../../../producer-profile';
import { ProductoForm } from '../components/ProductoForm';
import { eliminarProducto, getMisProductos } from '../services/producto.service';
import type { Producto } from '../types/producto.types';
import { CATEGORIA_LABELS } from '../types/producto.types';

export function MisProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tienePerfil, setTienePerfil] = useState<boolean | null>(null);

  const cargar = useCallback(() => {
    getMisProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos.'));
  }, []);

  useEffect(() => {
    // Verificar si tiene perfil primero
    getOwnProducerProfile()
      .then(() => {
        setTienePerfil(true);
        getMisProductos()
          .then((data) => {
            setProductos(data);
            setIsLoading(false);
          })
          .catch(() => {
            setError('No se pudieron cargar los productos.');
            setIsLoading(false);
          });
      })
      .catch(() => {
        setTienePerfil(false);
        setIsLoading(false);
      });
  }, []);

  function handleSuccess() {
    setCreando(false);
    setEditando(null);
    cargar();
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar.');
    }
  }

  if (isLoading) {
    return (
      <main className="container-xxl">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </div>
            <p className="text-secondary mb-0">Cargando productos...</p>
          </div>
        </div>
      </main>
    );
  }

  if (tienePerfil === false) {
    return (
      <main className="container-xxl">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xl-6">
            <section className="card border-warning shadow-sm rounded-4">
              <div className="card-body text-center p-4 p-lg-5">
                <div
                  className="bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '4rem', height: '4rem' }}
                  aria-hidden="true"
                >
                  <i className="bi bi-shop fs-2" />
                </div>

                <h1 className="h4 fw-bold mb-2">Primero configura tu perfil</h1>
                <p className="text-secondary mb-4">
                  Necesitas crear tu perfil de productor antes de poder registrar productos.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-success px-4"
                    onClick={() => navigate('/dashboard/proveedor/perfil')}
                  >
                    <i className="bi bi-person-vcard me-2" aria-hidden="true" />
                    Crear perfil
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/dashboard/proveedor')}
                  >
                    <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                    Volver
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
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
                <i className="bi bi-box-seam fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Catálogo del proveedor
                </p>

                <h1 className="h2 fw-bold mb-2">Mis productos</h1>

                <p className="text-secondary mb-0">
                  Registra, edita y administra los productos que ofreces a tus clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard/proveedor')}
              >
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Volver
              </button>

              {!creando && !editando && (
                <button type="button" className="btn btn-success" onClick={() => setCreando(true)}>
                  <i className="bi bi-plus-circle me-2" aria-hidden="true" />
                  Registrar producto
                </button>
              )}
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

      {(creando || editando) && (
        <section className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4 p-lg-5">
            <ProductoForm
              productoExistente={editando}
              onSuccess={handleSuccess}
              onCancel={() => {
                setCreando(false);
                setEditando(null);
              }}
            />
          </div>
        </section>
      )}

      {productos.length === 0 ? (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center p-4 p-lg-5">
            <div
              className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '4rem', height: '4rem' }}
              aria-hidden="true"
            >
              <i className="bi bi-box fs-2" />
            </div>

            <h2 className="h4 fw-bold mb-2">Aún no tienes productos registrados</h2>
            <p className="text-secondary mb-4">
              Crea tu primer producto para que los clientes puedan encontrarlo en el catálogo.
            </p>

            {!creando && !editando && (
              <button type="button" className="btn btn-success" onClick={() => setCreando(true)}>
                <i className="bi bi-plus-circle me-2" aria-hidden="true" />
                Registrar producto
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white border-0 p-4">
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">Inventario</p>
                <h2 className="h5 fw-bold mb-0">Productos registrados</h2>
              </div>

              <span className="badge text-bg-light border text-secondary ms-sm-auto">
                {productos.length} producto
                {productos.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Disponible</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="fw-semibold">{producto.nombre}</td>
                    <td>
                      <span className="badge text-bg-light border text-secondary">
                        <i className="bi bi-tag text-success me-1" aria-hidden="true" />
                        {CATEGORIA_LABELS[producto.categoria]}
                      </span>
                    </td>
                    <td className="fw-semibold text-success">${producto.precio.toFixed(2)}</td>
                    <td>{producto.cantidad}</td>
                    <td>
                      <span
                        className={`badge ${
                          producto.disponible ? 'text-bg-success' : 'text-bg-danger'
                        }`}
                      >
                        {producto.disponible ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditando(producto);
                            setCreando(false);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => void handleEliminar(producto.id)}
                        >
                          <i className="bi bi-trash me-1" aria-hidden="true" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
