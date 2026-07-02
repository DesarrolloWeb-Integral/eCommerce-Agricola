import type { AuditLog } from '../services/audit.service';

interface Props {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: Props) {
  if (logs.length === 0) {
    return <div className="alert alert-info">No hay registros de auditoría disponibles.</div>;
  }

  return (
    <div className="table-responsive shadow-sm rounded border bg-white">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Fecha e Hora</th>
            <th>Acción</th>
            <th>Usuario ID</th>
            <th>Recurso Afectado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="text-nowrap text-muted small">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td>
                <span
                  className={`badge ${
                    log.accion.includes('FALLIDO') || log.accion.includes('CANCELACION')
                      ? 'bg-danger-subtle text-danger'
                      : 'bg-success-subtle text-success'
                  }`}
                >
                  {log.accion}
                </span>
              </td>
              <td className="font-monospace small text-truncate" style={{ maxWidth: '150px' }}>
                {log.usuarioId}
              </td>
              <td>
                <code>{log.recursoAfectado}</code>
              </td>
              <td className="small text-muted">{log.detalle || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
