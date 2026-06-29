import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleDashboard } from '../components';
import { searchProducersByName, getRecommendedProducers } from '../../../producer-profile';
import type { PublicProducerProfile } from '../../../producer-profile';

function ProducerCard({
  profile,
  onClick,
}: {
  profile: PublicProducerProfile;
  onClick: () => void;
}) {
  return (
    <div
      className="card h-100 shadow-sm"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 40, height: 40, flexShrink: 0, fontSize: '1rem' }}
          >
            {profile.businessName.charAt(0).toUpperCase()}
          </div>
          <h5 className="card-title mb-0 text-truncate">{profile.businessName}</h5>
        </div>
        {profile.generalLocation && (
          <p className="text-muted small mb-1">📍 {profile.generalLocation}</p>
        )}
        {profile.description && (
          <p
            className="card-text small"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {profile.description}
          </p>
        )}
      </div>
      <div className="card-footer bg-transparent border-0 pt-0">
        <span className="text-success small fw-semibold">Ver perfil →</span>
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

  // Recomendados al montar — setState solo en .then/.catch (async callback)
  useEffect(() => {
    getRecommendedProducers(6)
      .then((data) => setRecommended(data))
      .catch(() => setRecommended([]))
      .finally(() => setIsLoadingRec(false));
  }, []);

  // Búsqueda con debounce — setState solo dentro del callback async del timer
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Si el query es corto, el debounce simplemente no se lanza;
    // los valores derivados los calcula useMemo abajo (sin setState en efecto)
    if (query.trim().length < 2) return;

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

  // ✅ Derivación sin setState — useMemo en lugar de useEffect
  const isActiveSearch = query.trim().length >= 2;
  const results = useMemo(
    () => (isActiveSearch ? asyncResults : []),
    [isActiveSearch, asyncResults]
  );
  const searchError = useMemo(
    () => (isActiveSearch ? asyncError : null),
    [isActiveSearch, asyncError]
  );

  const showRecommended = !isActiveSearch;

  return (
    <>
      <RoleDashboard
        title="Panel de cliente"
        description="Bienvenido. Desde aquí podrás consultar productos, realizar pedidos y dar seguimiento a tus compras."
      />

      <div style={{ padding: '0 1rem 2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Buscar productores</h2>
        <div className="input-group mb-3" style={{ maxWidth: 480 }}>
          <span className="input-group-text bg-white">🔍</span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre comercial…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {isSearching && (
            <span className="input-group-text bg-white">
              <span className="spinner-border spinner-border-sm text-success" />
            </span>
          )}
        </div>

        {isActiveSearch && (
          <>
            {searchError ? (
              <p className="text-muted small">{searchError}</p>
            ) : (
              <>
                <p className="text-muted small mb-3">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} para &ldquo;{query}
                  &rdquo;
                </p>
                <div className="row g-3">
                  {results.map((p) => (
                    <div className="col-sm-6 col-md-4" key={p.id}>
                      <ProducerCard profile={p} onClick={() => navigate(`/productores/${p.id}`)} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {showRecommended && (
          <>
            <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Productores recomendados
            </h3>
            {isLoadingRec ? (
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
            ) : recommended.length === 0 ? (
              <p className="text-muted small">Aún no hay productores registrados.</p>
            ) : (
              <div className="row g-3">
                {recommended.map((p) => (
                  <div className="col-sm-6 col-md-4" key={p.id}>
                    <ProducerCard profile={p} onClick={() => navigate(`/productores/${p.id}`)} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
