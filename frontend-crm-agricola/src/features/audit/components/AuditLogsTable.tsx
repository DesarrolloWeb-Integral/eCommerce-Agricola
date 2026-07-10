import { useMemo, useState } from 'react';
import type { AuditLog } from '../services/audit.service';

interface Props {
  logs: AuditLog[];
}

const PAGE_SIZE = 10;

// Formateador reutilizable: fuerza el horario de Ciudad de México (Hora del Centro)
// independientemente de la zona horaria del navegador del usuario.
const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

function formatMexicoDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return dateFormatter.format(date);
}

export function AuditLogsTable({ logs }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, currentPage]);

  // Si la lista de logs cambia (nuevo fetch) y la página actual queda fuera de rango, la corregimos.
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  if (logs.length === 0) {
    return (
      <div className="alert alert-info shadow-sm">No hay registros de auditoría disponibles.</div>
    );
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="shadow-sm rounded border bg-white">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 w-100">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: '15%' }}>
                Fecha e Hora
              </th>
              <th scope="col" style={{ width: '15%' }}>
                Acción
              </th>
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
            {paginatedLogs.map((log) => (
              <tr key={log.id}>
                <td className="text-nowrap text-muted small">{formatMexicoDate(log.createdAt)}</td>
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

      {/* Paginador */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
        <span className="text-muted small">
          Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, logs.length)} de {logs.length} registros
        </span>

        <nav aria-label="Paginación de bitácora">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              // Muestra un rango acotado de páginas alrededor de la actual para no saturar la UI
              .filter(
                (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
              )
              .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - arr[idx - 1] > 1) acc.push('ellipsis');
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === 'ellipsis' ? (
                  <li key={`ellipsis-${idx}`} className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                ) : (
                  <li key={item} className={`page-item ${currentPage === item ? 'active' : ''}`}>
                    <button type="button" className="page-link" onClick={() => goToPage(item)}>
                      {item}
                    </button>
                  </li>
                )
              )}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
