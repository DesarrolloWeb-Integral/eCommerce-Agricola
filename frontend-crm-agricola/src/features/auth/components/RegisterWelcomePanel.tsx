export function RegisterWelcomePanel() {
  return (
    <aside className="col-lg-5 d-none d-lg-flex bg-success text-white">
      <section className="welcome-panel w-100 d-flex flex-column justify-content-center p-5">
        <div>
          <div
            className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 welcome-icon"
            aria-hidden="true"
          >
            <i className="bi bi-flower1 fs-2" />
          </div>

          <p className="text-uppercase small fw-semibold letter-spacing text-white-50 mb-2">
            Plataforma agrícola
          </p>

          <h2 className="display-5 fw-bold mb-4">Bienvenido a nuestra comunidad agrícola.</h2>

          <p className="fs-5 text-white-50 mb-0">
            Regístrate para consultar productos, realizar pedidos y conectarte con proveedores del
            sector agrícola.
          </p>
        </div>
      </section>
    </aside>
  )
}
