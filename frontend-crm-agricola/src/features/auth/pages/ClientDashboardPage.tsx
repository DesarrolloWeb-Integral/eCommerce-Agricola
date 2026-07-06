import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRecommendedProducers, searchProducersByName } from '../../../producer-profile';
import type { PublicProducerProfile } from '../../../producer-profile';
import { DashboardActionCard } from '../components';

import '../../../styles/ClientDashboardPage.css';

function ProducerCard({
  profile,
  onClick,
}: {
  profile: PublicProducerProfile;
  onClick: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      onClick();
    }
  }

  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{ width: '3rem', height: '3rem' }}
            aria-hidden="true"
          >
            {profile.businessName.charAt(0).toUpperCase()}
          </div>

          <div className="overflow-hidden">
            <h3 className="h6 fw-bold mb-1 text-truncate">{profile.businessName}</h3>

            <p className="text-secondary small mb-0">Productor registrado</p>
          </div>
        </div>

        {profile.generalLocation && (
          <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
            <i className="bi bi-geo-alt text-success" aria-hidden="true" />
            <span className="text-truncate">{profile.generalLocation}</span>
          </div>
        )}

        {profile.description && (
          <p className="card-text text-secondary small mb-0">{profile.description}</p>
        )}
      </div>

      <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
        <span className="btn btn-outline-success btn-sm w-100">
          <i className="bi bi-person-lines-fill me-2" aria-hidden="true" />
          Ver perfil
        </span>
      </div>
    </div>
  );
}

export function ClientDashboardPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [asyncResults, setAsyncResults] = useState<PublicProducerProfile[]>([]);
  const [asyncError, setAsyncError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<PublicProducerProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRec, setIsLoadingRec] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getRecommendedProducers(6)
      .then((data) => setRecommended(data))
      .catch(() => setRecommended([]))
      .finally(() => setIsLoadingRec(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      setIsSearching(true);

      searchProducersByName(query.trim())
        .then((found) => {
          setAsyncResults(found);
          setAsyncError(found.length === 0 ? 'Sin resultados para esa búsqueda.' : null);
        })
        .catch(() => setAsyncError('Error al buscar. Intenta de nuevo.'))
        .finally(() => setIsSearching(false));
    }, 400);
  }, [query]);

  const isActiveSearch = query.trim().length >= 2;

  const results = useMemo(
    () => (isActiveSearch ? asyncResults : []),
    [asyncResults, isActiveSearch]
  );

  const searchError = useMemo(
    () => (isActiveSearch ? asyncError : null),
    [asyncError, isActiveSearch]
  );

  const showRecommended = !isActiveSearch;

  return (
    <main className="client-dashboard-page container-xxl">
      <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg">
            <div className="d-flex align-items-start gap-3">
              <div
                className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '3.75rem', height: '3.75rem' }}
                aria-hidden="true"
              >
                <i className="bi bi-person-check fs-3" />
              </div>

              <div>
                <p className="text-uppercase text-success fw-semibold small mb-1">
                  Panel principal
                </p>

                <h1 className="h2 fw-bold mb-2">Bienvenido, cliente</h1>

                <p className="text-secondary mb-0">
                  Consulta productos agrícolas, encuentra productores y da seguimiento a tus pedidos
                  desde un solo lugar.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
              <i className="bi bi-shield-check fs-5" aria-hidden="true" />
              <span>Acceso seguro a tu cuenta</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5" aria-labelledby="quick-actions-title">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">Accesos rápidos</p>

            <h2 id="quick-actions-title" className="h4 fw-bold mb-0">
              ¿Qué deseas realizar?
            </h2>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <DashboardActionCard
              icon="bi-bag-check"
              title="Catálogo de productos"
              eyebrow="Explora productos agrícolas disponibles."
              description="Consulta, busca y filtra productos de acuerdo con tus necesidades."
              buttonLabel="Ver catálogo"
              buttonIcon="bi-grid"
              onSelect={() => navigate('/dashboard/cliente/productos')}
            />
          </div>

          <div className="col-12 col-md-6">
            <DashboardActionCard
              icon="bi-box-seam"
              title="Mis pedidos"
              eyebrow="Revisa tus compras realizadas."
              description="Consulta el estado, detalle y seguimiento de cada pedido."
              buttonLabel="Ver mis pedidos"
              buttonIcon="bi-clipboard-check"
              onSelect={() => navigate('/dashboard/cliente/pedidos')}
            />
          </div>

          <div className="col-12 col-md-6">
            <DashboardActionCard
              icon="bi-chat-dots"
              title="Mis conversaciones"
              eyebrow="Comunícate con productores."
              description="Envía y responde mensajes relacionados con productos o pedidos."
              buttonLabel="Ver conversaciones"
              buttonIcon="bi-chat-left-text"
              onSelect={() => navigate('/dashboard/cliente/chat')}
            />
          </div>
        </div>
      </section>

      <section className="mb-5" aria-labelledby="producer-search-title">
        <div className="bg-white border rounded-4 shadow-sm p-4 p-lg-5">
          <div className="row align-items-end g-3">
            <div className="col-12 col-lg">
              <p className="text-uppercase text-success fw-semibold small mb-1">
                Directorio agrícola
              </p>

              <h2 id="producer-search-title" className="h4 fw-bold mb-2">
                Buscar productores
              </h2>

              <p className="text-secondary mb-0">Localiza productores por su nombre comercial.</p>
            </div>

            <div className="col-12 col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-success" aria-hidden="true" />
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por nombre comercial"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                  aria-label="Buscar productor por nombre comercial"
                />

                {isSearching && (
                  <span className="input-group-text bg-white">
                    <span
                      className="spinner-border spinner-border-sm text-success"
                      aria-label="Buscando"
                    />
                  </span>
                )}
              </div>

              <p className="form-text mb-0">
                Escribe al menos dos caracteres para iniciar la búsqueda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isActiveSearch && (
        <section className="mb-5" aria-live="polite">
          {searchError ? (
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
              <span>{searchError}</span>
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold mb-0">Resultados de búsqueda</h2>

                <span className="badge text-bg-success rounded-pill">
                  {results.length} resultado
                  {results.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="row g-4">
                {results.map((producer) => (
                  <div className="col-12 col-md-6 col-xl-4" key={producer.id}>
                    <ProducerCard
                      profile={producer}
                      onClick={() => navigate(`/productores/${producer.id}`)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {showRecommended && (
        <section aria-labelledby="recommended-producers-title">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <p className="text-uppercase text-success fw-semibold small mb-1">
                Selección destacada
              </p>

              <h2 id="recommended-producers-title" className="h4 fw-bold mb-0">
                Productores recomendados
              </h2>
            </div>

            <i className="bi bi-stars text-success fs-4" aria-hidden="true" />
          </div>

          {isLoadingRec ? (
            <div className="row g-4">
              {[...Array(3)].map((_, index) => (
                <div className="col-12 col-md-6 col-xl-4" key={index}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 placeholder-glow">
                      <span className="placeholder col-3 rounded-circle d-inline-block mb-4" />
                      <span className="placeholder col-8 d-block mb-3" />
                      <span className="placeholder col-10 d-block mb-2" />
                      <span className="placeholder col-6 d-block" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recommended.length === 0 ? (
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-info-circle text-success fs-5" aria-hidden="true" />
              <span>Aún no hay productores registrados.</span>
            </div>
          ) : (
            <div className="row g-4">
              {recommended.map((producer) => (
                <div className="col-12 col-md-6 col-xl-4" key={producer.id}>
                  <ProducerCard
                    profile={producer}
                    onClick={() => navigate(`/productores/${producer.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
