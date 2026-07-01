import { useState } from 'react';

// Metadata del aviso — se guarda junto al consentimiento
export const PRIVACY_NOTICE_VERSION = '1.0';
export const PRIVACY_NOTICE_DATE = '2026-06-16';

interface PrivacyConsentSectionProps {
  /** Callback con la fecha ISO en que el usuario aceptó */
  onConsentChange: (accepted: boolean, acceptedAt: string | null, version: string) => void;
  /** Estado actual del checkbox (controlado desde el formulario padre) */
  accepted: boolean;
  /** Mostrar error si intentaron enviar sin aceptar */
  showError?: boolean;
}

export function PrivacyConsentSection({
  onConsentChange,
  accepted,
  showError = false,
}: PrivacyConsentSectionProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onConsentChange(checked, checked ? new Date().toISOString() : null, PRIVACY_NOTICE_VERSION);
  };

  return (
    <>
      {/* ── Checkbox de consentimiento ── */}
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
            He leído y acepto el{' '}
            <button
              type="button"
              className="btn btn-link btn-sm p-0 align-baseline text-success fw-semibold"
              onClick={() => setShowModal(true)}
            >
              Aviso de Privacidad
            </button>{' '}
            de eCommerce-Agricola conforme a la legislación del Estado de Guanajuato.
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
            Aceptado el {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })} — versión{' '}
            {PRIVACY_NOTICE_VERSION}
          </p>
        )}
      </div>

      {/* ── Modal con el aviso completo ── */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header bg-success text-white">
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Aviso de Privacidad Simplificado</h5>
                    <small className="opacity-75">
                      eCommerce-Agricola · Versión {PRIVACY_NOTICE_VERSION} · Actualizado el 16 de
                      junio de 2026
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                  />
                </div>

                {/* Body */}
                <div className="modal-body px-4 py-3 small">
                  <p className="text-muted">
                    <strong>eCommerce-Agricola</strong>, en coordinación con la Universidad
                    Tecnológica del Norte de Guanajuato (UTNG), con domicilio en Avenida Educación
                    Tecnológica núm. 34, Fracc. Universidad, C.P. 37800, Dolores Hidalgo, Gto., es
                    el responsable del tratamiento de sus datos personales, conforme a la{' '}
                    <em>
                      Ley de Protección de Datos Personales en Posesión de Sujetos Obligados para el
                      Estado de Guanajuato
                    </em>
                    .
                  </p>

                  <hr />

                  {/* I. Finalidades */}
                  <h6 className="fw-bold text-success">I. Finalidades del Tratamiento</h6>

                  <p className="fw-semibold mb-1">Finalidades Primarias</p>
                  <ul className="mb-2">
                    <li>Registro, autenticación y gestión de usuarios dentro de la plataforma.</li>
                    <li>
                      Procesamiento y seguimiento de proyectos socioproductivos, tecnológicos o de
                      la Incubadora de Empresas de la UTNG.
                    </li>
                    <li>Seguimiento académico y técnico de módulos y prácticas profesionales.</li>
                  </ul>

                  <p className="fw-semibold mb-1">Finalidades Secundarias (Adicionales)</p>
                  <ul className="mb-2">
                    <li>
                      Fines estadísticos internos para la mejora de la plataforma (sin que los
                      titulares sean identificables).
                    </li>
                  </ul>

                  <div className="alert alert-warning py-2 small">
                    Si no desea que sus datos se traten para fines estadísticos, puede oponerse
                    enviando un correo a{' '}
                    <a href="mailto:gaelq1074@gmail.com">gaelq1074@gmail.com</a> o ante la Unidad de
                    Transparencia.
                  </div>

                  <hr />

                  {/* II. Datos */}
                  <h6 className="fw-bold text-success">II. Datos Personales Recabados</h6>
                  <ul>
                    <li>
                      <strong>Identificación y contacto:</strong> nombre completo, edad, género,
                      correo electrónico, teléfono.
                    </li>
                    <li>
                      <strong>Académicos y de vinculación:</strong> escuela/programa, matrícula o
                      registro de incubación.
                    </li>
                    <li>No se recaban datos sensibles (origen étnico, estado de salud, etc.).</li>
                  </ul>

                  <hr />

                  {/* III. Transferencia */}
                  <h6 className="fw-bold text-success">III. Transferencia de Datos</h6>
                  <p>
                    Sus datos podrán transmitirse a autoridades federales, estatales o municipales
                    cuando sea necesario para el ejercicio de sus facultades, o a entidades
                    vinculadas al servicio educativo y tecnológico de la UTNG.
                  </p>

                  <hr />

                  {/* IV. ARCO */}
                  <h6 className="fw-bold text-success">IV. Derechos ARCO</h6>
                  <p className="mb-1">
                    Puede presentar solicitudes de Acceso, Rectificación, Cancelación u Oposición
                    ante la Unidad de Transparencia:
                  </p>
                  <ul>
                    <li>
                      <strong>Plataforma:</strong>{' '}
                      <a
                        href="http://www.plataformadetransparencia.org.mx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.plataformadetransparencia.org.mx
                      </a>
                    </li>
                    <li>
                      <strong>Correo:</strong>{' '}
                      <a href="mailto:unidadtransparencia@guanajuato.gob.mx">
                        unidadtransparencia@guanajuato.gob.mx
                      </a>
                    </li>
                    <li>
                      <strong>Domicilio:</strong> Calle San Sebastián #78, Zona Centro, Guanajuato,
                      Gto., C.P. 36000. Tel. (473) 688 04 70.
                    </li>
                  </ul>

                  <hr />

                  {/* V. Aviso integral */}
                  <h6 className="fw-bold text-success">V. Aviso Integral y Cambios</h6>
                  <p className="mb-0">
                    Consulte el aviso integral en{' '}
                    <a href="https://www.utng.edu.mx" target="_blank" rel="noopener noreferrer">
                      www.utng.edu.mx
                    </a>
                    . Cualquier modificación se notificará por medios electrónicos o correo.
                  </p>
                </div>

                {/* Footer */}
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
