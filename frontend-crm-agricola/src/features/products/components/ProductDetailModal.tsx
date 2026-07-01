import type { ProductoDetalle } from '../types/producto.types';
import { CATEGORIA_LABELS } from '../types/producto.types';

interface ProductDetailModalProps {
  detalle: ProductoDetalle | null;
  isLoading: boolean;
  onClose: () => void;
  onViewProducer: (producerId: string) => void;
}

export function ProductDetailModal({
  detalle,
  isLoading,
  onClose,
  onViewProducer,
}: ProductDetailModalProps) {
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header">
              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Detalle del producto
                </p>
                <h2 className="modal-title h5 fw-bold">{detalle?.nombre ?? 'Cargando...'}</h2>
              </div>

              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>

            <div className="modal-body p-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando detalle...</span>
                  </div>
                </div>
              ) : (
                detalle && (
                  <div className="row g-4">
                    <div className="col-12 col-lg-7">
                      <span className="badge text-bg-light border text-secondary mb-3">
                        <i className="bi bi-tag text-success me-1" aria-hidden="true" />
                        {CATEGORIA_LABELS[detalle.categoria]}
                      </span>

                      <p className="text-secondary">{detalle.descripcion}</p>

                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <tbody>
                            <tr>
                              <th scope="row">Precio</th>
                              <td className="fw-bold text-success">${detalle.precio.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <th scope="row">Cantidad disponible</th>
                              <td>{detalle.cantidad} unidades</td>
                            </tr>
                            <tr>
                              <th scope="row">Disponible</th>
                              <td>
                                <span
                                  className={`badge ${
                                    detalle.disponible ? 'text-bg-success' : 'text-bg-danger'
                                  }`}
                                >
                                  {detalle.disponible ? 'Sí' : 'No'}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-12 col-lg-5">
                      <aside className="card bg-light border rounded-4 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <i
                              className="bi bi-person-vcard text-success fs-4"
                              aria-hidden="true"
                            />
                            <h3 className="h6 fw-bold mb-0">Productor</h3>
                          </div>

                          <p className="mb-2 fw-semibold">{detalle.productor.businessName}</p>

                          {detalle.productor.generalLocation && (
                            <p className="mb-2 text-secondary small">
                              <i className="bi bi-geo-alt text-success me-2" aria-hidden="true" />
                              {detalle.productor.generalLocation}
                            </p>
                          )}

                          {detalle.productor.contactPhone && (
                            <p className="mb-2 small">
                              <i className="bi bi-telephone text-success me-2" aria-hidden="true" />
                              {detalle.productor.contactPhone}
                            </p>
                          )}

                          {detalle.productor.contactEmail && (
                            <p className="mb-3 small">
                              <i className="bi bi-envelope text-success me-2" aria-hidden="true" />
                              {detalle.productor.contactEmail}
                            </p>
                          )}

                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm w-100"
                            onClick={() => onViewProducer(detalle.productor.id)}
                          >
                            <i className="bi bi-person-lines-fill me-2" aria-hidden="true" />
                            Ver perfil del productor
                          </button>
                        </div>
                      </aside>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
