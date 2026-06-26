export function RegisterFormHeader() {
  return (
    <header className="border-bottom pb-4 mb-4">
      <div className="d-flex align-items-center gap-3">
        <div
          className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center register-icon-container"
          aria-hidden="true"
        >
          <i className="bi bi-person-plus fs-3" />
        </div>

        <div>
          <p className="text-uppercase small fw-semibold text-success mb-1">Registro de usuario</p>

          <h1 className="h2 fw-bold mb-1">Crear cuenta</h1>

          <p className="text-secondary mb-0">Completa tus datos para registrarte como cliente.</p>
        </div>
      </div>
    </header>
  )
}
