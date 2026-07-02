import type { AuditLog } from '../services/audit.service';

interface Props {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="alert alert-info shadow-sm">No hay registros de auditoría disponibles.</div>
    );
  }

  return (
    <div className="table-responsive shadow-sm rounded border bg-white">
      {/* Añadimos w-100 y table-layout fijo controlado por clases */}
      <table className="table table-hover align-middle mb-0 w-100">
        <thead className="table-light">
          <tr>
            <th scope="col" style={{ width: '15%' }}>
              Fecha e Hora
            </th>
            <th scope="col" style={{ width: '15%' }}>
              Acción
            </th>
            {/* Le damos más peso al ID y quitamos límites duros */}
            <th scope="col" style={{ width: '30%' }}>
              Usuario ID
            </th>
            <th scope="col" style={{ width: '15%' }}>
              Recurso Afectado
            </th>
            <th scope="col">Detalle</th>
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
                  className={`badge d-inline-block px-2 py-1 ${
                    log.accion.includes('FALLIDO') || log.accion.includes('CANCELACION')
                      ? 'bg-danger-subtle text-danger'
                      : 'bg-success-subtle text-success'
                  }`}
                >
                  {log.accion}
                </span>
              </td>
              {/* - text-break: rompe el UUID si la pantalla es chica sin ocultar caracteres.
                - font-monospace: mejora la lectura de hashes/IDs.
              */}
              <td className="font-monospace small text-break text-dark fw-medium">
                {log.usuarioId}
              </td>
              <td>
                <span className="text-secondary small bg-light px-2 py-1 rounded border">
                  {log.recursoAfectado}
                </span>
              </td>
              <td className="small text-muted text-wrap">{log.detalle || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
