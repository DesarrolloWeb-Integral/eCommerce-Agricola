import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/hooks';
import { useToast } from '../../../shared/hooks/useToast';
import {
  PRIVACY_NOTICE_CONTACT_EMAIL,
  PRIVACY_NOTICE_RESPONSIBLE_NAME,
} from '../../../shared/components/privacy/PrivacyNotice';
import {
  acceptCurrentPrivacyNotice,
  cancelMyAccount,
  exportMyData,
  keepMyAccount,
} from '../services/account.service';
import { useAccount } from '../hooks/useAccount';
import type { UpdateAccountData } from '../types/account.types';

function formatDate(value: string | null): string {
  if (!value) return 'Pendiente';

  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function downloadJson(data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `mis-datos-agroconecta-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function getAccountStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVA: 'Activa',
    CANCELACION_PENDIENTE: 'Cancelacion pendiente',
    CANCELADA: 'Cancelada',
  };

  return labels[status] ?? status;
}

function getAccountStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    ACTIVA: 'text-bg-success',
    CANCELACION_PENDIENTE: 'text-bg-warning',
    CANCELADA: 'text-bg-secondary',
  };

  return classes[status] ?? 'text-bg-light';
}

export function AccountPage() {
  const { account, requests, isLoading, error, reload, saveAccount, opposeTransfers } =
    useAccount();
  const { logoutSession } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [oppositionReason, setOppositionReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOpposing, setIsOpposing] = useState(false);
  const [isUpdatingConsents, setIsUpdatingConsents] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmCancellation, setConfirmCancellation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isKeepingAccount, setIsKeepingAccount] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSaving(true);

    try {
      const fields = new FormData(event.currentTarget);
      const data: UpdateAccountData = {
        name: String(fields.get('name') ?? ''),
        lastName: String(fields.get('lastName') ?? ''),
        email: String(fields.get('email') ?? ''),
        phone: String(fields.get('phone') ?? '').trim() || null,
      };

      await saveAccount(data);
      setShowEditModal(false);
      showToast('Datos actualizados correctamente.', { type: 'success' });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron actualizar tus datos.',
        { type: 'error' }
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExport(): Promise<void> {
    setIsExporting(true);

    try {
      const data = await exportMyData();
      downloadJson(data);
      showToast('Archivo JSON generado correctamente.', { type: 'success' });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo descargar la exportacion.',
        { type: 'error' }
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function handleOpposition(): Promise<void> {
    setIsOpposing(true);

    try {
      await opposeTransfers(oppositionReason);
      setOppositionReason('');
      showToast('Solicitud ARCO registrada correctamente.', { type: 'success' });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error ? requestError.message : 'No se pudo registrar la solicitud.',
        { type: 'error' }
      );
    } finally {
      setIsOpposing(false);
    }
  }

  async function handleAcceptCurrentPrivacyNotice(): Promise<void> {
    setIsUpdatingConsents(true);

    try {
      await acceptCurrentPrivacyNotice();
      await reload();
      showToast('Aviso de privacidad actualizado.', { type: 'success' });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron actualizar las aceptaciones.',
        { type: 'error' }
      );
    } finally {
      setIsUpdatingConsents(false);
    }
  }

  async function handleCancellation(): Promise<void> {
    setIsCancelling(true);

    try {
      const response = await cancelMyAccount({
        currentPassword,
        confirmCancellation,
      });

      await logoutSession();
      navigate('/login', {
        replace: true,
        state: {
          message: response.message,
        },
      });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error ? requestError.message : 'No se pudo cancelar la cuenta.',
        { type: 'error' }
      );
      await reload();
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleKeepAccount(): Promise<void> {
    setIsKeepingAccount(true);

    try {
      await keepMyAccount();
      await reload();
      showToast('La cuenta se mantuvo activa correctamente.', { type: 'success' });
    } catch (requestError: unknown) {
      showToast(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo mantener activa la cuenta.',
        { type: 'error' }
      );
    } finally {
      setIsKeepingAccount(false);
    }
  }

  const isCancelled = account?.estadoCuenta === 'CANCELADA';
  const isCancellationPending = account?.estadoCuenta === 'CANCELACION_PENDIENTE';
  const hasPendingLegalUpdate = Boolean(account) && !account?.privacyNoticeAcceptedAt;
  const accountDetails = account
    ? [
        {
          label: 'Nombre',
          value: account.name,
        },
        {
          label: 'Apellidos',
          value: account.lastName,
        },
        {
          label: 'Correo',
          value: account.email,
        },
        {
          label: 'Telefono',
          value: account.phone ?? 'No registrado',
        },
        {
          label: 'Rol',
          value: account.role,
        },
        {
          label: 'Registro',
          value: formatDate(account.createdAt),
        },
        {
          label: 'Estado',
          value: getAccountStatusLabel(account.estadoCuenta),
          isStatus: true,
        },
      ]
    : [];

  return (
    <main className="container-xxl">
      <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5 mb-4">
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between">
          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">Cuenta privada</p>
            <h1 className="h2 fw-bold mb-2">Mi cuenta</h1>
            <p className="text-secondary mb-0">
              Consulta tus datos, gestiona privacidad y ejerce tus derechos ARCO.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-success align-self-start"
            onClick={() => void reload()}
          >
            <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
            Actualizar
          </button>
        </div>
      </section>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {isLoading || !account ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Cargando cuenta...</span>
            </div>
            <p className="text-secondary mb-0">Cargando cuenta...</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {hasPendingLegalUpdate && (
            <div className="col-12">
              <div className="alert alert-warning d-flex flex-column flex-lg-row gap-3 align-items-lg-center">
                <div>
                  <p className="fw-semibold mb-1">Actualizacion de privacidad pendiente</p>
                  <p className="mb-0">
                    Revisa y acepta la version vigente del Aviso de Privacidad para dejar evidencia
                    tecnica con fecha del servidor.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-success ms-lg-auto"
                  disabled={isUpdatingConsents}
                  onClick={() => void handleAcceptCurrentPrivacyNotice()}
                >
                  <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                  Aceptar aviso vigente
                </button>
              </div>
            </div>
          )}

          <div className="col-12">
            <section className="bg-white border rounded-4 shadow-sm p-4">
              <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-start mb-3">
                <div className="d-flex align-items-start gap-3">
                  <span
                    className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '2.75rem', height: '2.75rem' }}
                    aria-hidden="true"
                  >
                    <i className="bi bi-person-lines-fill fs-5" />
                  </span>
                  <div>
                    <p className="text-uppercase text-success fw-semibold small mb-1">
                      Datos de cuenta
                    </p>
                    <h2 className="h5 fw-bold mb-1">Mis datos personales</h2>
                    <p className="text-secondary mb-0">
                      {account.name} {account.lastName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-success align-self-start"
                  disabled={isCancelled}
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="bi bi-pencil-square me-2" aria-hidden="true" />
                  Editar datos
                </button>
              </div>

              <div className="row g-0 mb-0 border-top border-start">
                {accountDetails.map((detail) => (
                  <div
                    className="col-12 col-sm-6 col-xl-3 border-end border-bottom"
                    key={detail.label}
                  >
                    <div className="px-3 py-3 h-100">
                      <p className="text-secondary small mb-1">{detail.label}</p>
                      {detail.isStatus ? (
                        <span
                          className={`badge rounded-pill ${getAccountStatusBadgeClass(
                            account.estadoCuenta
                          )}`}
                        >
                          {detail.value}
                        </span>
                      ) : (
                        <p className="fw-semibold text-break mb-0">{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-12">
            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-4">
                  <div>
                    <h2 className="h5 fw-bold mb-2">Privacidad y derechos ARCO</h2>
                    <p className="text-secondary mb-0">
                      Responsable: {PRIVACY_NOTICE_RESPONSIBLE_NAME} - Contacto:{' '}
                      {PRIVACY_NOTICE_CONTACT_EMAIL}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-success align-self-start"
                    onClick={() => void handleExport()}
                    disabled={isExporting}
                  >
                    <i className="bi bi-download me-2" aria-hidden="true" />
                    Descargar mis datos
                  </button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-lg-6">
                    <div className="border rounded p-3 h-100">
                      <p className="fw-semibold mb-1">Aviso de Privacidad</p>
                      <p className="text-secondary small mb-0">
                        Version {account.privacyNoticeVersion ?? 'pendiente'} -{' '}
                        {formatDate(account.privacyNoticeAcceptedAt)}
                      </p>
                      <Link className="link-success small" to="/aviso-privacidad">
                        Consultar aviso
                      </Link>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="border rounded p-3 h-100">
                      <p className="fw-semibold mb-1">Finalidades opcionales</p>
                      <p className="text-secondary small mb-0">
                        {account.optionalPurposesAllowed ? 'Activas' : 'Desactivadas'}
                      </p>
                      <p className="text-secondary small mb-0">
                        Actualizado: {formatDate(account.optionalPurposesUpdatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row g-3 align-items-end mb-4">
                  <div className="col-12 col-lg">
                    <label className="form-label fw-semibold" htmlFor="opposition-reason">
                      Motivo de oposicion
                    </label>
                    <textarea
                      id="opposition-reason"
                      className="form-control"
                      rows={3}
                      maxLength={1000}
                      value={oppositionReason}
                      onChange={(event) => setOppositionReason(event.target.value)}
                      placeholder="Describe la oposicion a transferencias o finalidades no necesarias."
                    />
                  </div>
                  <div className="col-12 col-lg-auto">
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      disabled={isOpposing || oppositionReason.trim().length === 0}
                      onClick={() => void handleOpposition()}
                    >
                      <i className="bi bi-shield-slash me-2" aria-hidden="true" />
                      Solicitar oposicion
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Solicitud</th>
                        <th>Respuesta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-secondary">
                            No tienes solicitudes ARCO registradas.
                          </td>
                        </tr>
                      ) : (
                        requests.map((request) => (
                          <tr key={request.id}>
                            <td>{request.type}</td>
                            <td>
                              <span className="badge text-bg-light border">{request.status}</span>
                            </td>
                            <td>{formatDate(request.requestedAt)}</td>
                            <td>{request.response ?? 'Sin respuesta aun'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          <div className="col-12">
            <section
              className={`card shadow-sm rounded-4 ${
                isCancellationPending ? 'border-warning' : 'border-danger'
              }`}
            >
              <div className="card-body p-4">
                <h2
                  className={`h5 fw-bold mb-2 ${
                    isCancellationPending ? 'text-warning-emphasis' : 'text-danger'
                  }`}
                >
                  {isCancellationPending ? 'Cancelacion pendiente' : 'Zona de peligro'}
                </h2>
                {isCancellationPending ? (
                  <>
                    <p className="text-secondary">
                      Tu cuenta tiene una solicitud de cancelacion pendiente. Puedes mantenerla
                      activa si ya no deseas continuar con el proceso.
                    </p>
                    <button
                      type="button"
                      className="btn btn-warning"
                      disabled={isKeepingAccount}
                      onClick={() => void handleKeepAccount()}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true" />
                      {isKeepingAccount ? 'Manteniendo cuenta...' : 'Mantener cuenta'}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-secondary">
                      No podras volver a iniciar sesion. Tus identificadores personales directos
                      seran disociados. Pedidos, productos y pagos historicos necesarios no seran
                      eliminados.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={isCancelled}
                      onClick={() => setShowCancelModal(true)}
                    >
                      <i className="bi bi-person-x me-2" aria-hidden="true" />
                      Solicitar cancelacion de cuenta
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {showEditModal && account && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <form
                className="modal-content border-0 shadow"
                key={account.updatedAt}
                onSubmit={(event) => void handleSave(event)}
              >
                <div className="modal-header">
                  <h2 className="modal-title h5 fw-bold">Editar mis datos</h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    disabled={isSaving}
                    onClick={() => setShowEditModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="account-name">
                        Nombre
                      </label>
                      <input
                        id="account-name"
                        name="name"
                        className="form-control"
                        defaultValue={account.name}
                        maxLength={100}
                        disabled={isCancelled || isSaving}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="account-last-name">
                        Apellidos
                      </label>
                      <input
                        id="account-last-name"
                        name="lastName"
                        className="form-control"
                        defaultValue={account.lastName}
                        maxLength={100}
                        disabled={isCancelled || isSaving}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="account-email">
                        Correo
                      </label>
                      <input
                        id="account-email"
                        name="email"
                        type="email"
                        className="form-control"
                        defaultValue={account.email}
                        maxLength={150}
                        disabled={isCancelled || isSaving}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="account-phone">
                        Telefono <span className="text-secondary fw-normal">(opcional)</span>
                      </label>
                      <input
                        id="account-phone"
                        name="phone"
                        className="form-control"
                        defaultValue={account.phone ?? ''}
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isCancelled || isSaving}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={isSaving}
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={isCancelled || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2" aria-hidden="true" />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {showCancelModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h2 className="modal-title h5 fw-bold">Confirmar cancelacion</h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setShowCancelModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning">
                    La accion puede no completarse de inmediato si existen obligaciones activas.
                  </div>
                  <label className="form-label fw-semibold" htmlFor="cancel-password">
                    Contrasena actual
                  </label>
                  <input
                    id="cancel-password"
                    type="password"
                    className="form-control mb-3"
                    value={currentPassword}
                    maxLength={72}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                  <div className="form-check">
                    <input
                      id="confirm-cancellation"
                      className="form-check-input"
                      type="checkbox"
                      checked={confirmCancellation}
                      onChange={(event) => setConfirmCancellation(event.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="confirm-cancellation">
                      Confirmo que deseo solicitar la cancelacion de mi cuenta.
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={isCancelling}
                    onClick={() => setShowCancelModal(false)}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={isCancelling || !confirmCancellation || currentPassword.length === 0}
                    onClick={() => void handleCancellation()}
                  >
                    Cancelar cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </main>
  );
}
