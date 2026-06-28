import { useEffect, useState } from 'react'
import type { PublicProducerProfile } from '../types/producer-profile.types'
import { getPublicProducerProfile } from '../services/producer-profile.service'

interface Props {
  profileId: string
}

/**
 * Vista pública del perfil de un productor.
 * No muestra ningún dato privado (internalNotes, userId, etc.).
 */
export function PublicProducerProfileView({ profileId }: Props) {
  const [profile, setProfile] = useState<PublicProducerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicProducerProfile(profileId)
      .then(setProfile)
      .catch((err) => setError(err.message ?? 'No se pudo cargar el perfil.'))
      .finally(() => setIsLoading(false))
  }, [profileId])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        {error ?? 'Perfil no encontrado.'}
      </div>
    )
  }

  const socialPlatforms = Object.entries(profile.socialLinks ?? {}).filter(([, url]) => !!url)

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

      <p className="text-muted small">
        Miembro desde{' '}
        {new Date(profile.createdAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
        })}
      </p>
    </div>
  )
}
