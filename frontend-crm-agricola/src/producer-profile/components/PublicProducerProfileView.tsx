import { useEffect, useState } from 'react';

import { getProductosPorProductor } from '../../features/products/services/producto.service';
import { CATEGORIA_LABELS } from '../../features/products/types/producto.types';
import type { Producto } from '../../features/products/types/producto.types';
import { getPublicProducerProfile } from '../services/producer-profile.service';
import type { PublicProducerProfile } from '../types/producer-profile.types';

interface Props {
  profileId: string;
}

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
      <main className="container-xxl">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-secondary mb-0">Cargando perfil...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="container-xxl">
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          <span>{error ?? 'Perfil no encontrado.'}</span>
        </div>
      </main>
    );
  }

  const socialPlatforms = Object.entries(profile.socialLinks ?? {}).filter(([, url]) => !!url);

  return (
    <main className="container-xxl">
      <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg">
            <div className="d-flex align-items-start gap-3">
              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-3 flex-shrink-0"
                style={{ width: '4rem', height: '4rem' }}
                aria-hidden="true"
              >
                {profile.businessName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Perfil de productor
                </p>

                <h1 className="h2 fw-bold mb-2">{profile.businessName}</h1>

                {profile.generalLocation && (
                  <p className="text-secondary mb-0">
                    <i className="bi bi-geo-alt text-success me-1" aria-hidden="true" />
                    {profile.generalLocation}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <span className="badge text-bg-light border text-secondary">
              <i className="bi bi-calendar3 text-success me-1" aria-hidden="true" />
              Miembro desde{' '}
              {new Date(profile.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
        </div>
      </section>

      <div className="row g-4 mb-4">
        {profile.description && (
          <div className="col-12 col-lg-8">
            <section className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-3">Acerca del productor</h2>
                <p className="text-secondary mb-0">{profile.description}</p>
              </div>
            </section>
          </div>
        )}

        {(profile.contactPhone || profile.contactEmail || socialPlatforms.length > 0) && (
          <div className={profile.description ? 'col-12 col-lg-4' : 'col-12'}>
            <section className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-3">Contacto</h2>

                <ul className="list-unstyled mb-0">
                  {profile.contactPhone && (
                    <li className="mb-2">
                      <i className="bi bi-telephone me-2 text-success" aria-hidden="true" />
                      <a
                        className="link-success text-decoration-none"
                        href={`tel:${profile.contactPhone}`}
                      >
                        {profile.contactPhone}
                      </a>
                    </li>
                  )}

                  {profile.contactEmail && (
                    <li className="mb-2">
                      <i className="bi bi-envelope me-2 text-success" aria-hidden="true" />
                      <a
                        className="link-success text-decoration-none"
                        href={`mailto:${profile.contactEmail}`}
                      >
                        {profile.contactEmail}
                      </a>
                    </li>
                  )}

                  {socialPlatforms.map(([platform, url]) => (
                    <li key={platform} className="mb-2">
                      <i className={`bi bi-${platform} me-2 text-success`} aria-hidden="true" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-success text-decoration-none text-capitalize"
                      >
                        {platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>

      <section aria-labelledby="producer-products-title">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">Catálogo</p>

            <h2 id="producer-products-title" className="h4 fw-bold mb-0">
              Productos disponibles
            </h2>
          </div>
        </div>

        {isLoadingProductos ? (
          <div className="row g-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="col-12 col-md-6 col-xl-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4 placeholder-glow">
                    <span className="placeholder col-4 d-block mb-3" />
                    <span className="placeholder col-8 d-block mb-2" />
                    <span className="placeholder col-10 d-block mb-2" />
                    <span className="placeholder col-6 d-block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="alert alert-light border d-flex align-items-center gap-2 mb-0">
            <i className="bi bi-info-circle text-success fs-5" aria-hidden="true" />
            <span>Este productor aún no tiene productos disponibles.</span>
          </div>
        ) : (
          <div className="row g-4">
            {productos.map((producto) => (
              <div key={producto.id} className="col-12 col-md-6 col-xl-4">
                <article className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4 d-flex flex-column">
                    <span className="badge text-bg-light border text-secondary mb-3 align-self-start">
                      <i className="bi bi-tag text-success me-1" aria-hidden="true" />
                      {CATEGORIA_LABELS[producto.categoria]}
                    </span>

                    <h3 className="h5 fw-bold mb-2">{producto.nombre}</h3>
                    <p className="card-text text-secondary small flex-grow-1">
                      {producto.descripcion}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fs-6 fw-bold text-success">
                        ${producto.precio.toFixed(2)}
                      </span>
                      <span className="text-secondary small">{producto.cantidad} uds.</span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
