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
  } = useForm<GetUserByIdFormData>();

  async function onSubmit(data: GetUserByIdFormData): Promise<void> {
    await getUser(data.userId);
  }

  return (
    <main>
      <h1>Consultar usuario</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="userId">UUID del usuario</label>

          <input
            id="userId"
            type="text"
            {...register('userId', {
              required: 'El UUID del usuario es obligatorio.',
            })}
          />

          {errors.userId && <p>{errors.userId.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Consultando...' : 'Consultar usuario'}
        </button>
      </form>

      {user && (
        <section>
          <h2>Información del usuario</h2>

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
