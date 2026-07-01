import { useForm } from 'react-hook-form';

import { useGetUserById } from '../hooks';

interface GetUserByIdFormData {
  userId: string;
}

export function GetUserByIdPage() {
  const { getUser, user } = useGetUserById();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GetUserByIdFormData>({ mode: 'onTouched' });

  async function onSubmit(data: GetUserByIdFormData): Promise<void> {
    await getUser(data.userId);
  }

  return (
    <main className="container-xxl">
      <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
        <div className="d-flex align-items-start gap-3">
          <div
            className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '3.75rem', height: '3.75rem' }}
            aria-hidden="true"
          >
            <i className="bi bi-person-search fs-3" />
          </div>

          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">Administración</p>

            <h1 className="h2 fw-bold mb-2">Consultar usuario</h1>

            <p className="text-secondary mb-0">
              Ingresa el UUID de una cuenta para revisar su información registrada.
            </p>
          </div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <section className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-3">Búsqueda</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label fw-semibold">
                    UUID del usuario <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-fingerprint text-success" aria-hidden="true" />
                    </span>

                    <input
                      id="userId"
                      type="text"
                      className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                      autoComplete="off"
                      aria-invalid={errors.userId ? 'true' : 'false'}
                      {...register('userId', {
                        required: 'El UUID del usuario es obligatorio.',
                        pattern: {
                          value:
                            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                          message: 'Ingresa un UUID v4 válido.',
                        },
                      })}
                    />
                  </div>

                  {errors.userId && (
                    <div className="invalid-feedback d-block">{errors.userId.message}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2" aria-hidden="true" />
                      Consultar usuario
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-7">
          {user ? (
            <section className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-start gap-3 mb-4">
                  <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '3.25rem', height: '3.25rem' }}
                    aria-hidden="true"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-uppercase text-success fw-semibold small mb-1">
                      Información del usuario
                    </p>
                    <h2 className="h5 fw-bold mb-1">
                      {user.name} {user.lastName}
                    </h2>
                    <p className="text-secondary small mb-0">{user.email}</p>
                  </div>

                  <span
                    className={`badge ms-sm-auto ${
                      user.isActive ? 'text-bg-success' : 'text-bg-danger'
                    }`}
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <tbody>
                      <tr>
                        <th scope="row">ID</th>
                        <td>{user.id}</td>
                      </tr>
                      <tr>
                        <th scope="row">Teléfono</th>
                        <td>{user.phone}</td>
                      </tr>
                      <tr>
                        <th scope="row">Rol</th>
                        <td>{user.role}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <section className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body text-center p-4 p-lg-5">
                <div
                  className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '4rem', height: '4rem' }}
                  aria-hidden="true"
                >
                  <i className="bi bi-person-lines-fill fs-2" />
                </div>

                <h2 className="h5 fw-bold mb-2">Sin usuario seleccionado</h2>
                <p className="text-secondary mb-0">
                  El resultado de la consulta aparecerá en esta sección.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
