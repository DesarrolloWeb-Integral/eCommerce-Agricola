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
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mb-0">Cargando perfil...</p>
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
    <div className="row justify-content-center">
      <div className="col-12 col-xl-9">
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div
            className={`toast align-items-center text-bg-success border-0 ${
              showToast ? 'show' : ''
            }`}
            role="alert"
            aria-live="assertive"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold">
                <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                {isEditing ? 'Perfil actualizado correctamente.' : 'Perfil creado correctamente.'}
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

        <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '3.75rem', height: '3.75rem' }}
                  aria-hidden="true"
                >
                  <i className="bi bi-person-vcard fs-3" />
                </div>

                <div>
                  <p className="text-uppercase text-success fw-semibold small mb-1">
                    Perfil público
                  </p>

                  <h1 className="h2 fw-bold mb-2">
                    {isEditing ? 'Editar perfil' : 'Crear perfil de productor'}
                  </h1>

                  <p className="text-secondary mb-0">
                    Esta información será visible para los clientes que visiten tu perfil.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-auto">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard/proveedor')}
              >
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Volver al dashboard
              </button>
            </div>
          </div>
        </section>

        {apiError && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>{apiError}</span>
          </div>
        )}

        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-lg-5">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <h2 className="h5 fw-bold mb-1">Información del negocio</h2>
                <p className="text-secondary small mb-0">
                  Completa los datos generales con los que te encontrarán los clientes.
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="businessName" className="form-label fw-semibold">
                  Nombre comercial <span className="text-danger">*</span>
                </label>
                <input type="text" maxLength={120} {...field('businessName')} />
                {errors.businessName && (
                  <div className="invalid-feedback">{errors.businessName}</div>
                )}
                <div className="form-text">{form.businessName.length}/120 caracteres</div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  placeholder="Cuéntanos sobre tu negocio..."
                  {...field('description')}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                <div className="form-text">{form.description.length}/1 000 caracteres</div>
              </div>

              <div className="mb-4">
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

              <fieldset className="border rounded-4 p-3 p-md-4 mb-4">
                <legend className="float-none w-auto h6 fw-bold px-2 mb-0">
                  Medios de contacto
                </legend>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label htmlFor="contactPhone" className="form-label">
                      Teléfono
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-telephone text-success" aria-hidden="true" />
                      </span>
                      <input
                        type="tel"
                        maxLength={20}
                        placeholder="+52 477 123 4567"
                        {...field('contactPhone')}
                      />
                    </div>
                    {errors.contactPhone && (
                      <div className="invalid-feedback d-block">{errors.contactPhone}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="contactEmail" className="form-label">
                      Correo de contacto
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-envelope text-success" aria-hidden="true" />
                      </span>
                      <input
                        type="email"
                        maxLength={254}
                        placeholder="ventas@mirancho.com"
                        {...field('contactEmail')}
                      />
                    </div>
                    {errors.contactEmail && (
                      <div className="invalid-feedback d-block">{errors.contactEmail}</div>
                    )}
                    <div className="form-text">Puede ser diferente al correo de tu cuenta.</div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border rounded-4 p-3 p-md-4 mb-4">
                <legend className="float-none w-auto h6 fw-bold px-2 mb-0">Redes sociales</legend>

                <div className="row g-3 mt-1">
                  {(['whatsapp', 'facebook', 'instagram'] as const).map((platform) => (
                    <div className="col-md-4" key={platform}>
                      <label htmlFor={`social-${platform}`} className="form-label text-capitalize">
                        {platform}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className={`bi bi-${platform} text-success`} aria-hidden="true" />
                        </span>
                        <input
                          id={`social-${platform}`}
                          type="url"
                          maxLength={300}
                          placeholder={`https://${platform}.com/...`}
                          value={form.socialLinks[platform] ?? ''}
                          onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                          onBlur={() => handleBlur('socialLinks')}
                          className={`form-control${errors.socialLinks ? ' is-invalid' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.socialLinks && (
                  <div className="text-danger small mt-2">{errors.socialLinks}</div>
                )}
              </fieldset>

              <div className="mb-4">
                <label htmlFor="internalNotes" className="form-label fw-semibold">
                  Notas internas <span className="badge text-bg-secondary fw-normal">Privadas</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Información privada solo visible para ti..."
                  {...field('internalNotes')}
                />
                {errors.internalNotes && (
                  <div className="invalid-feedback">{errors.internalNotes}</div>
                )}
                <div className="form-text">
                  Estas notas <strong>no</strong> se muestran a los clientes.
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button type="submit" className="btn btn-success px-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                      {isEditing ? 'Guardar cambios' : 'Crear perfil'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigate('/dashboard/proveedor')}
                  disabled={isLoading}
                >
                  <i className="bi bi-x-lg me-2" aria-hidden="true" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
