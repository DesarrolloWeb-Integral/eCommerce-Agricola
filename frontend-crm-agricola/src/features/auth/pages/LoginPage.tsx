import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLoginUser } from '../hooks/useLoginUser';
import type { LoginUserData } from '../types';
import { validateTrimmedRequired } from '../../../shared/validators/security.validators';

import '../../../styles/LoginPage.css';

interface LoginLocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const { login } = useLoginUser();

  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LoginLocationState | null;
  const redirectPath = locationState?.from?.pathname ?? '/dashboard';

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserData>({
    mode: 'onTouched',
  });

  async function onSubmit(data: LoginUserData): Promise<void> {
    const wasLoggedIn = await login(data);

    if (wasLoggedIn) {
      navigate(redirectPath, {
        replace: true,
      });
    }
  }
  function togglePasswordVisibility(): void {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  return (
    <main className="login-page min-vh-100">
      <div className="container-fluid min-vh-100 p-0">
        <div className="row g-0 min-vh-100">
          <aside className="col-lg-6 d-none d-lg-flex bg-success text-white">
            <section className="login-welcome-panel w-100 d-flex flex-column justify-content-center p-5">
              <div className="login-welcome-content">
                <div
                  className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 login-welcome-icon"
                  aria-hidden="true"
                >
                  <i className="bi bi-flower1 fs-2" />
                </div>

                <p className="text-uppercase small fw-semibold letter-spacing text-white-50 mb-2">
                  Plataforma agrícola
                </p>

                <h1 className="display-5 fw-bold mb-4">Bienvenido de nuevo</h1>

                <p className="fs-5 text-white-50 mb-0">
                  Inicia sesión para consultar productos agrícolas, gestionar tus pedidos y
                  mantenerte conectado con el sector del campo.
                </p>
              </div>
            </section>
          </aside>

          <section className="col-12 col-lg-6 bg-white">
            <div className="login-form-container h-100 d-flex align-items-center justify-content-center">
              <div className="w-100 p-4 p-md-5">
                <div className="login-form-content mx-auto">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">
                      <header className="border-bottom pb-4 mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center login-form-icon"
                            aria-hidden="true"
                          >
                            <i className="bi bi-box-arrow-in-right fs-3" />
                          </div>

                          <div>
                            <p className="text-uppercase small fw-semibold text-success mb-1">
                              Acceso a la plataforma
                            </p>

                            <h2 className="h3 fw-bold mb-1">Iniciar sesión</h2>

                            <p className="text-secondary mb-0">
                              Ingresa tus credenciales para continuar.
                            </p>
                          </div>
                        </div>
                      </header>

                      <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="row g-4">
                          <div className="col-12">
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
                                    message:
                                      'El correo electrónico no puede superar los 150 caracteres.',
                                  },
                                  pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Ingresa un correo electrónico válido.',
                                  },
                                })}
                              />
                            </div>

                            {errors.email && (
                              <div className="invalid-feedback d-block">{errors.email.message}</div>
                            )}
                          </div>

                          <div className="col-12">
                            <label htmlFor="password" className="form-label fw-semibold">
                              Contraseña <span className="text-danger">*</span>
                            </label>

                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-shield-lock" aria-hidden="true" />
                              </span>

                              <input
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
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

                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                aria-label={
                                  isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                }
                                title={
                                  isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                }
                                onClick={togglePasswordVisibility}
                              >
                                <i
                                  className={`bi ${isPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`}
                                  aria-hidden="true"
                                />
                              </button>
                            </div>

                            {errors.password && (
                              <div className="invalid-feedback d-block">
                                {errors.password.message}
                              </div>
                            )}
                          </div>

                          <div className="col-12">
                            <button
                              type="submit"
                              className="btn btn-success w-100 py-2 fw-semibold"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    aria-hidden="true"
                                  />
                                  Iniciando sesión...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
                                  Iniciar sesión
                                </>
                              )}
                            </button>
                          </div>

                          <div className="col-12">
                            <p className="text-center text-secondary small mb-0">
                              ¿No tienes cuenta?{' '}
                              <Link
                                to="/registro"
                                className="link-success fw-semibold text-decoration-none"
                              >
                                Registrarme
                              </Link>
                            </p>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
