import React from 'react'
import { useProducerProfileForm } from '../hooks/useProducerProfileForm'

/**
 * Formulario de creación / edición del perfil de productor.
 * Usa Bootstrap 5 (clases estándar) tal como el resto del proyecto.
 */
export function ProducerProfileForm() {
  const {
    form,
    errors,
    isLoading,
    isFetching,
    apiError,
    successMessage,
    isEditing,
    handleChange,
    handleSocialLinkChange,
    handleBlur,
    handleSubmit,
  } = useProducerProfileForm()

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    )
  }

  const field = (name: keyof typeof form) => ({
    id: name,
    name,
    value: form[name] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    className: `form-control${errors[name] ? ' is-invalid' : ''}`,
    disabled: isLoading,
  })

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-1">{isEditing ? 'Editar perfil' : 'Crear perfil de productor'}</h2>
      <p className="text-muted mb-4">
        Esta información será visible para los clientes que visiten tu perfil.
      </p>

      {apiError && (
        <div className="alert alert-danger" role="alert">
          {apiError}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Nombre comercial ── */}
        <div className="mb-3">
          <label htmlFor="businessName" className="form-label fw-semibold">
            Nombre comercial <span className="text-danger">*</span>
          </label>
          <input type="text" maxLength={120} {...field('businessName')} />
          {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
          <div className="form-text">{form.businessName.length}/120 caracteres</div>
        </div>

        {/* ── Descripción ── */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold">
            Descripción
          </label>
          <textarea
            rows={4}
            maxLength={1000}
            {...field('description')}
            placeholder="Cuéntanos sobre tu negocio, productos y valores…"
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          <div className="form-text">{form.description.length}/1 000 caracteres</div>
        </div>

        {/* ── Ubicación general ── */}
        <div className="mb-3">
          <label htmlFor="generalLocation" className="form-label fw-semibold">
            Ubicación general
          </label>
          <input
            type="text"
            maxLength={200}
            placeholder="Ej. Dolores Hidalgo, Guanajuato"
            {...field('generalLocation')}
          />
          {errors.generalLocation && (
            <div className="invalid-feedback">{errors.generalLocation}</div>
          )}
          <div className="form-text">
            Indica estado y municipio. No se solicita dirección exacta.
          </div>
        </div>

        {/* ── Contacto ── */}
        <fieldset className="mb-3">
          <legend className="fw-semibold fs-6 mb-2">Medios de contacto</legend>

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="contactPhone" className="form-label">
                Teléfono
              </label>
              <input type="tel" placeholder="+52 477 123 4567" {...field('contactPhone')} />
              {errors.contactPhone && <div className="invalid-feedback">{errors.contactPhone}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="contactEmail" className="form-label">
                Correo de contacto
              </label>
              <input type="email" placeholder="ventas@mirancho.com" {...field('contactEmail')} />
              {errors.contactEmail && <div className="invalid-feedback">{errors.contactEmail}</div>}
              <div className="form-text">Puede ser diferente al correo de tu cuenta.</div>
            </div>
          </div>
        </fieldset>

        {/* ── Redes sociales ── */}
        <fieldset className="mb-3">
          <legend className="fw-semibold fs-6 mb-2">Redes sociales</legend>
          <div className="row g-3">
            {(['whatsapp', 'facebook', 'instagram'] as const).map((platform) => (
              <div className="col-md-4" key={platform}>
                <label htmlFor={`social-${platform}`} className="form-label text-capitalize">
                  {platform}
                </label>
                <input
                  id={`social-${platform}`}
                  type="url"
                  placeholder={`https://${platform}.com/…`}
                  value={form.socialLinks[platform] ?? ''}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                  onBlur={() => handleBlur('socialLinks')}
                  className={`form-control${errors.socialLinks ? ' is-invalid' : ''}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          {errors.socialLinks && <div className="text-danger small mt-1">{errors.socialLinks}</div>}
        </fieldset>

        {/* ── Notas internas (PRIVADAS) ── */}
        <div className="mb-4">
          <label htmlFor="internalNotes" className="form-label fw-semibold">
            Notas internas <span className="badge bg-secondary fw-normal">privadas</span>
          </label>
          <textarea
            rows={3}
            maxLength={2000}
            placeholder="Información privada solo visible para ti…"
            {...field('internalNotes')}
          />
          {errors.internalNotes && <div className="invalid-feedback">{errors.internalNotes}</div>}
          <div className="form-text">
            Estas notas <strong>no</strong> se muestran a los clientes.
          </div>
        </div>

        <button type="submit" className="btn btn-success px-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Guardando…
            </>
          ) : isEditing ? (
            'Guardar cambios'
          ) : (
            'Crear perfil'
          )}
        </button>
      </form>
    </div>
  )
}
