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
    <main className="container py-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">Consultar usuario</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label fw-semibold">
            UUID del usuario <span className="text-danger">*</span>
          </label>

          <input
            id="userId"
            type="text"
            className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
            autoComplete="off"
            aria-invalid={errors.userId ? 'true' : 'false'}
            {...register('userId', {
              required: 'El UUID del usuario es obligatorio.',
              pattern: {
                value: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                message: 'Ingresa un UUID v4 válido.',
              },
            })}
          />

          {errors.userId && <div className="invalid-feedback d-block">{errors.userId.message}</div>}
        </div>

        <button type="submit" className="btn btn-success" disabled={isSubmitting}>
          {isSubmitting ? 'Consultando...' : 'Consultar usuario'}
        </button>
      </form>

      {user && (
        <section className="mt-4">
          <h2 className="h5">Información del usuario</h2>

          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Apellido:</strong> {user.lastName}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.phone}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
          <p>
            <strong>Activo:</strong> {user.isActive ? 'Sí' : 'No'}
          </p>
        </section>
      )}
    </main>
  );
}
