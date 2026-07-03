import { useState, type ChangeEvent } from 'react';

import {
  PRIVACY_NOTICE_DATE,
  PRIVACY_NOTICE_VERSION,
  PrivacyNoticeContent,
} from '../../../shared/components/privacy/PrivacyNotice';

interface PrivacyConsentSectionProps {
  onConsentChange: (accepted: boolean, acceptedAt: string | null, version: string) => void;
  accepted: boolean;
  showError?: boolean;
}

export function PrivacyConsentSection({
  onConsentChange,
  accepted,
  showError = false,
}: PrivacyConsentSectionProps) {
  const [showModal, setShowModal] = useState(false);

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>): void {
    const checked = event.target.checked;
    onConsentChange(checked, checked ? new Date().toISOString() : null, PRIVACY_NOTICE_VERSION);
  }

  return (
    <>
      <div
        className={`mb-3 p-3 rounded border ${showError && !accepted ? 'border-danger bg-danger bg-opacity-10' : 'border-light'}`}
      >
        <div className="form-check">
          <input
            className={`form-check-input ${showError && !accepted ? 'is-invalid' : ''}`}
            type="checkbox"
            id="privacyConsent"
            checked={accepted}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label small" htmlFor="privacyConsent">
            He leido y acepto el{' '}
            <button
              type="button"
              className="btn btn-link btn-sm p-0 align-baseline text-success fw-semibold"
              onClick={() => setShowModal(true)}
            >
              Aviso de Privacidad
            </button>{' '}
            de eCommerce-Agricola conforme a la legislacion del Estado de Guanajuato.
          </label>
          {showError && !accepted && (
            <div className="invalid-feedback d-block">
              Debes aceptar el Aviso de Privacidad para continuar.
            </div>
          )}
        </div>

        {accepted && (
          <p className="text-muted mb-0 mt-2 small">
            <i className="bi bi-check2-circle text-success me-1" aria-hidden="true" />
            Aceptado el {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })} - version{' '}
            {PRIVACY_NOTICE_VERSION}
          </p>
        )}
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            onClick={(event) => event.target === event.currentTarget && setShowModal(false)}
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Aviso de Privacidad Simplificado</h5>
                    <small className="opacity-75">
                      eCommerce-Agricola - Version {PRIVACY_NOTICE_VERSION} - Actualizado el{' '}
                      {PRIVACY_NOTICE_DATE}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                  />
                </div>

                <div className="modal-body px-4 py-3">
                  <PrivacyNoticeContent />
                </div>

                <div className="modal-footer flex-column flex-sm-row gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      onConsentChange(true, new Date().toISOString(), PRIVACY_NOTICE_VERSION);
                      setShowModal(false);
                    }}
                  >
                    Entendido, acepto el Aviso de Privacidad
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
        </>
      )}
    </>
  );
}
