import type { KeyboardEvent } from 'react';

interface DashboardActionCardProps {
  icon: string;
  title: string;
  eyebrow: string;
  description: string;
  buttonLabel: string;
  buttonIcon: string;
  onSelect: () => void;
}

export function DashboardActionCard({
  icon,
  title,
  eyebrow,
  description,
  buttonLabel,
  buttonIcon,
  onSelect,
}: DashboardActionCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      onSelect();
    }
  }

  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '3.5rem', height: '3.5rem' }}
            aria-hidden="true"
          >
            <i className={`bi ${icon} fs-3`} />
          </div>

          <div>
            <h3 className="h5 fw-bold mb-1">{title}</h3>
            <p className="text-secondary small mb-0">{eyebrow}</p>
          </div>
        </div>

        <p className="text-secondary mb-0">{description}</p>
      </div>

      <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
        <span className="btn btn-success w-100">
          <i className={`bi ${buttonIcon} me-2`} aria-hidden="true" />
          {buttonLabel}
        </span>
      </div>
    </div>
  );
}
