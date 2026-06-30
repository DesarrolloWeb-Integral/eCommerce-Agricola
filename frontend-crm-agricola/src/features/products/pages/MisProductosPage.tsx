import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductoForm } from '../components/ProductoForm';
import { getMisProductos, eliminarProducto } from '../services/producto.service';
import { getOwnProducerProfile } from '../../../producer-profile';
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
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  // Sin perfil — bloquear acceso
  if (tienePerfil === false) {
    return (
      <div className="container py-5" style={{ maxWidth: 520 }}>
        <div className="card border-warning shadow-sm">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: '3rem' }}>🏪</div>
            <h4 className="fw-bold mt-3 mb-2">Primero configura tu perfil</h4>
            <p className="text-muted mb-4">
              Necesitas crear tu perfil de productor antes de poder registrar productos.
            </p>
            <button
              className="btn btn-success px-4"
              onClick={() => navigate('/dashboard/proveedor/perfil')}
            >
              Crear perfil de productor
            </button>
            <button
              className="btn btn-outline-secondary ms-2 px-4"
              onClick={() => navigate('/dashboard/proveedor')}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/dashboard/proveedor')}
        >
          ← Volver
        </button>
        <h2 className="mb-0">Mis productos</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {creando || editando ? (
        <div className="card p-4 mb-4">
          <ProductoForm
            productoExistente={editando}
            onSuccess={handleSuccess}
            onCancel={() => {
              setCreando(false);
              setEditando(null);
            }}
          />
        </div>
      ) : (
        <button className="btn btn-success mb-4" onClick={() => setCreando(true)}>
          + Registrar producto
        </button>
      )}

      {productos.length === 0 ? (
        <p className="text-muted">Aún no tienes productos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>
                    <span className="badge bg-secondary">{CATEGORIA_LABELS[p.categoria]}</span>
                  </td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.cantidad}</td>
                  <td>
                    <span className={`badge ${p.disponible ? 'bg-success' : 'bg-danger'}`}>
                      {p.disponible ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditando(p);
                          setCreando(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
