import { useEffect, useState } from 'react';
import { auditService, type AuditLog } from '../services/audit.service';
import { AuditLogsTable } from '../components/AuditLogsTable';

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auditService
      .getLogs()
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch((err: Error) => {
        // Tu apiClient ya procesa y concatena los mensajes de error del backend
        setError(err.message || 'No se pudieron cargar los registros de auditoría.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Se ejecuta una sola vez al montar el componente

  return (
    <main className="container-xxl py-4">
      <div className="mb-4">
        <p className="text-uppercase text-success fw-semibold small mb-1">Seguridad</p>
        <h1 className="h3 fw-bold">Bitácora de Auditoría</h1>
        <p className="text-muted">
          Historial detallado de las operaciones críticas realizadas en la plataforma.
        </p>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando logs...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && <AuditLogsTable logs={logs} />}
    </main>
  );
}
