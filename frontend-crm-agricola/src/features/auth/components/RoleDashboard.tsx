interface RoleDashboardProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: string;
}

export function RoleDashboard({
  title,
  description,
  eyebrow = 'Panel principal',
  icon = 'bi-speedometer2',
}: RoleDashboardProps) {
  return (
    <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
      <div className="d-flex align-items-start gap-3">
        <div
          className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: '3.75rem', height: '3.75rem' }}
          aria-hidden="true"
        >
          <i className={`bi ${icon} fs-3`} />
        </div>

        <div>
          <p className="text-uppercase text-success fw-semibold small mb-1">{eyebrow}</p>

          <h1 className="h2 fw-bold mb-2">{title}</h1>

          <p className="text-secondary mb-0">{description}</p>
        </div>
      </div>
    </section>
  );
}
