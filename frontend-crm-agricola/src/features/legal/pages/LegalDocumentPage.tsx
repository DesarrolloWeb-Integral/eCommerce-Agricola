import { Link } from 'react-router-dom';

import {
  PRIVACY_NOTICE_DATE,
  PRIVACY_NOTICE_RESPONSIBLE_NAME,
  PRIVACY_NOTICE_VERSION,
  PrivacyNoticeContent,
} from '../../../shared/components/privacy/PrivacyNotice';

export function LegalDocumentPage() {
  return (
    <main className="container-xxl">
      <section className="bg-white border rounded-4 shadow-sm p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-4">
          <div>
            <p className="text-uppercase text-success fw-semibold small mb-1">
              {PRIVACY_NOTICE_RESPONSIBLE_NAME}
            </p>
            <h1 className="h2 fw-bold mb-2">Aviso de Privacidad</h1>
            <p className="text-secondary mb-0">
              Version {PRIVACY_NOTICE_VERSION} - Actualizado el {PRIVACY_NOTICE_DATE}
            </p>
          </div>

          <Link to="/dashboard/mi-cuenta" className="btn btn-outline-success align-self-start">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Volver
          </Link>
        </div>

        <PrivacyNoticeContent />
      </section>
    </main>
  );
}
