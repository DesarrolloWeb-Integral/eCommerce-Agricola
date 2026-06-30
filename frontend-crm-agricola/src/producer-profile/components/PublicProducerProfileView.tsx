import { useEffect, useState } from 'react';
import type { PublicProducerProfile } from '../types/producer-profile.types';
import { getPublicProducerProfile } from '../services/producer-profile.service';
import { getProductosPorProductor } from '../../features/products/services/producto.service';
import { CATEGORIA_LABELS } from '../../features/products/types/producto.types';
import type { Producto } from '../../features/products/types/producto.types';

interface Props {
  profileId: string;
}

/**
 * Vista pública del perfil de un productor.
 * No muestra ningún dato privado (internalNotes, userId, etc.).
 * Incluye el catálogo de productos disponibles de ese productor.
 */
export function PublicProducerProfileView({ profileId }: Props) {
  const [profile, setProfile] = useState<PublicProducerProfile | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicProducerProfile(profileId)
      .then(setProfile)
      .catch((err) => setError(err.message ?? 'No se pudo cargar el perfil.'))
      .finally(() => setIsLoading(false));
  }, [profileId]);

  useEffect(() => {
    getProductosPorProductor(profileId)
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setIsLoadingProductos(false));
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        {error ?? 'Perfil no encontrado.'}
      </div>
    );
  }

  const socialPlatforms = Object.entries(profile.socialLinks ?? {}).filter(([, url]) => !!url);

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      {/* Encabezado */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div
          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-4"
          style={{ width: 64, height: 64, flexShrink: 0 }}
          aria-hidden="true"
        >
          {profile.businessName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="h3 mb-0">{profile.businessName}</h1>
          {profile.generalLocation && (
            <p className="text-muted mb-0">
              <i className="bi bi-geo-alt me-1" />
              {profile.generalLocation}
            </p>
          )}
        </div>
      </div>

      {/* Descripción */}
      {profile.description && (
        <p className="mb-4" style={{ whiteSpace: 'pre-line' }}>
          {profile.description}
        </p>
      )}

      {/* Medios de contacto */}
      {(profile.contactPhone || profile.contactEmail || socialPlatforms.length > 0) && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h6 card-title fw-semibold mb-3">Contacto</h2>
            <ul className="list-unstyled mb-0">
              {profile.contactPhone && (
                <li className="mb-2">
                  <i className="bi bi-telephone me-2 text-success" />
                  <a href={`tel:${profile.contactPhone}`}>{profile.contactPhone}</a>
                </li>
              )}
              {profile.contactEmail && (
                <li className="mb-2">
                  <i className="bi bi-envelope me-2 text-success" />
                  <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
                </li>
              )}
              {socialPlatforms.map(([platform, url]) => (
                <li key={platform} className="mb-2">
                  <i className={`bi bi-${platform} me-2 text-success`} />
                  <a
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-capitalize"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Productos del productor ── */}
      <h2 className="h5 fw-semibold mb-3">Productos disponibles</h2>

      {isLoadingProductos ? (
        <div className="d-flex gap-3 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card" style={{ width: 200, height: 140, opacity: 0.4 }}>
              <div className="card-body placeholder-glow">
                <span className="placeholder col-8 mb-2 d-block" />
                <span className="placeholder col-6 d-block" />
              </div>
            </div>
          ))}
        </div>
      ) : productos.length === 0 ? (
        <p className="text-muted small">Este productor aún no tiene productos disponibles.</p>
      ) : (
        <div className="row g-3 mb-4">
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
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {p.descripcion}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fs-6 fw-bold text-success">${p.precio.toFixed(2)}</span>
                    <span className="text-muted small">{p.cantidad} uds.</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-muted small">
        Miembro desde{' '}
        {new Date(profile.createdAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
        })}
      </p>
    </div>
  );
}
