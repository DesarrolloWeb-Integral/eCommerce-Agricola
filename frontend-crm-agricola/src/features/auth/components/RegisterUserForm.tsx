import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PrivacyConsentSection } from './Privacyconsentsection';
import type { RegisterUserData } from '../types';
import {
  validateSafeText,
  validateTrimmedRequired,
} from '../../../shared/validators/security.validators';

interface RegisterUserFormProps {
  onRegister: (userData: RegisterUserData) => Promise<boolean>;
}

export function RegisterUserForm({ onRegister }: RegisterUserFormProps) {
  const navigate = useNavigate();
  const [privacyNoticeAccepted, setPrivacyNoticeAccepted] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserData>({ mode: 'onTouched' });

  async function onSubmit(data: RegisterUserData): Promise<void> {
    if (!privacyNoticeAccepted) {
      setShowConsentError(true);
      return;
    }

    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';

    const wasRegistered = await onRegister({
      ...data,
      phone: phone.length > 0 ? phone : null,
      privacyNoticeAccepted,
    });

    if (wasRegistered) {
      reset();
      setPrivacyNoticeAccepted(false);
      setShowConsentError(false);
    }
  }

  function handleCancel(): void {
    reset();
    setPrivacyNoticeAccepted(false);
    setShowConsentError(false);
    navigate('/login');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label fw-semibold">
            Nombre <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person" aria-hidden="true" />
            </span>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu nombre"
              autoComplete="given-name"
              maxLength={100}
              {...register('name', {
                required: 'El nombre es obligatorio.',
                maxLength: {
                  value: 100,
                  message: 'El nombre no puede superar los 100 caracteres.',
                },
                validate: {
                  trimmed: (value) => validateTrimmedRequired(value, 'El nombre es obligatorio.'),
                  safe: (value) => validateSafeText(value, 'El nombre'),
                },
              })}
            />
          </div>
          {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="lastName" className="form-label fw-semibold">
            Apellido <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person-vcard" aria-hidden="true" />
            </span>
            <input
              id="lastName"
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu apellido"
              autoComplete="family-name"
              maxLength={100}
              {...register('lastName', {
                required: 'El apellido es obligatorio.',
                maxLength: {
                  value: 100,
                  message: 'El apellido no puede superar los 100 caracteres.',
                },
                validate: {
                  trimmed: (value) => validateTrimmedRequired(value, 'El apellido es obligatorio.'),
                  safe: (value) => validateSafeText(value, 'El apellido'),
                },
              })}
            />
          </div>
          {errors.lastName && (
            <div className="invalid-feedback d-block">{errors.lastName.message}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label fw-semibold">
            Correo electrónico <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-envelope" aria-hidden="true" />
            </span>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              maxLength={150}
              {...register('email', {
                required: 'El correo electrónico es obligatorio.',
                maxLength: {
                  value: 150,
                  message: 'El correo electrónico no puede superar los 150 caracteres.',
                },
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Ingresa un correo electrónico válido.',
                },
              })}
            />
          </div>
          {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="phone" className="form-label fw-semibold">
            Teléfono <span className="text-secondary fw-normal">(opcional)</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-telephone" aria-hidden="true" />
            </span>
            <input
              id="phone"
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="10 dígitos"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              {...register('phone', {
                validate: (value) =>
                  !value ||
                  /^\d{10}$/.test(value) ||
                  'El teléfono debe tener exactamente 10 dígitos.',
              })}
            />
          </div>
          {errors.phone && <div className="invalid-feedback d-block">{errors.phone.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="role" className="form-label fw-semibold">
            Rol <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person-badge" aria-hidden="true" />
            </span>
            <select
              id="role"
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
              defaultValue=""
              {...register('role', { required: 'Selecciona un rol.' })}
            >
              <option value="" disabled>
                Selecciona un rol
              </option>
              <option value="CLIENTE">Cliente</option>
              <option value="PROVEEDOR">Proveedor</option>
            </select>
          </div>
          {errors.role && <div className="invalid-feedback d-block">{errors.role.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="password" className="form-label fw-semibold">
            Contraseña <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-shield-lock" aria-hidden="true" />
            </span>
            <input
              id="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              maxLength={72}
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres.',
                },
                maxLength: {
                  value: 72,
                  message: 'La contraseña no puede superar los 72 caracteres.',
                },
                validate: (value) =>
                  validateTrimmedRequired(value, 'La contraseña es obligatoria.'),
              })}
            />
          </div>
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password.message}</div>
          )}
        </div>

        {/* ── Aviso de Privacidad ── */}
        <div className="col-12">
          <PrivacyConsentSection
            accepted={privacyNoticeAccepted}
            showError={showConsentError}
            onConsentChange={(accepted) => {
              setPrivacyNoticeAccepted(accepted);
              if (accepted) setShowConsentError(false);
            }}
          />
        </div>

        <div className="col-12">
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              <i className="bi bi-x-circle me-2" aria-hidden="true" />
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={isSubmitting || !privacyNoticeAccepted}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Registrando...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2" aria-hidden="true" />
                  Registrarme
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
