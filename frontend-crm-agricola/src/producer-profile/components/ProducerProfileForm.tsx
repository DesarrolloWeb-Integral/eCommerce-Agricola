import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducerProfileForm } from '../hooks/useProducerProfileForm';

export function ProducerProfileForm() {
  const navigate = useNavigate();
  const {
    form,
    errors,
    isLoading,
    isFetching,
    apiError,
    showToast,
    setShowToast,
    isEditing,
    handleChange,
    handleSocialLinkChange,
    handleBlur,
    handleSubmit,
  } = useProducerProfileForm();

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
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
  });

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      {/* Toast flotante */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div
          className={`toast align-items-center text-bg-success border-0 ${showToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold">
              ✅ {isEditing ? 'Perfil actualizado correctamente.' : 'Perfil creado correctamente.'}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
              aria-label="Cerrar"
            />
          </div>
        </div>
      </div>

      {/* Encabezado */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/dashboard/proveedor')}
        >
          ← Volver al dashboard
        </button>
        <h2 className="mb-0">{isEditing ? 'Editar perfil' : 'Crear perfil de productor'}</h2>
      </div>

      <p className="text-muted mb-4">
        Esta información será visible para los clientes que visiten tu perfil.
      </p>

      {apiError && (
        <div className="alert alert-danger" role="alert">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="businessName" className="form-label fw-semibold">
            Nombre comercial <span className="text-danger">*</span>
          </label>
          <input type="text" maxLength={120} {...field('businessName')} />
          {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
          <div className="form-text">{form.businessName.length}/120 caracteres</div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold">
            Descripción
          </label>
          <textarea
            rows={4}
            maxLength={1000}
            placeholder="Cuéntanos sobre tu negocio…"
            {...field('description')}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          <div className="form-text">{form.description.length}/1 000 caracteres</div>
        </div>

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

        <div className="d-flex gap-2">
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
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/dashboard/proveedor')}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
