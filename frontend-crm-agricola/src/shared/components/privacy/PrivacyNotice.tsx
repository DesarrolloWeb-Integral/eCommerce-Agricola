export const PRIVACY_NOTICE_VERSION = '1.0';
export const PRIVACY_NOTICE_DATE = '2026-06-16';
export const PRIVACY_NOTICE_RESPONSIBLE_NAME = 'eCommerce-Agricola';
export const PRIVACY_NOTICE_CONTACT_EMAIL = 'gaelq1074@gmail.com';

export function PrivacyNoticeContent() {
  return (
    <div className="small">
      <p className="text-muted">
        <strong>eCommerce-Agricola</strong>, en coordinacion con la Universidad Tecnologica del
        Norte de Guanajuato (UTNG), con domicilio en Avenida Educacion Tecnologica num. 34, Fracc.
        Universidad, C.P. 37800, Dolores Hidalgo, Gto., es el responsable del tratamiento de sus
        datos personales, conforme a la Ley de Proteccion de Datos Personales en Posesion de Sujetos
        Obligados para el Estado de Guanajuato.
      </p>

      <hr />

      <h6 className="fw-bold text-success">I. Finalidades del Tratamiento</h6>

      <p className="fw-semibold mb-1">Finalidades primarias</p>
      <ul className="mb-2">
        <li>Registro, autenticacion y gestion de usuarios dentro de la plataforma.</li>
        <li>Publicacion, consulta y administracion de productos agricolas.</li>
        <li>Gestion de pedidos, pagos y seguimiento operativo entre clientes y productores.</li>
        <li>Atencion de solicitudes relacionadas con derechos ARCO.</li>
      </ul>

      <p className="fw-semibold mb-1">Finalidades secundarias</p>
      <ul className="mb-2">
        <li>
          Analisis estadistico interno para mejorar la plataforma, sin identificar directamente al
          titular.
        </li>
      </ul>

      <div className="alert alert-warning py-2 small">
        El usuario puede oponerse a transferencias o finalidades no necesarias desde la seccion Mi
        cuenta.
      </div>

      <hr />

      <h6 className="fw-bold text-success">II. Datos Personales Recabados</h6>
      <ul>
        <li>
          <strong>Identificacion y contacto:</strong> nombre, apellidos, correo electronico y
          telefono opcional cuando el usuario decida proporcionarlo.
        </li>
        <li>
          <strong>Operacion de la plataforma:</strong> rol, productos, pedidos, pagos, estados de
          cuenta y solicitudes ARCO.
        </li>
        <li>No se recaban datos personales sensibles.</li>
      </ul>

      <hr />

      <h6 className="fw-bold text-success">III. Transferencia de Datos</h6>
      <p>
        Los datos podran transmitirse a autoridades competentes o proveedores tecnologicos cuando
        sea necesario para prestar el servicio, cumplir obligaciones legales o procesar pagos de la
        operacion.
      </p>

      <hr />

      <h6 className="fw-bold text-success">IV. Derechos ARCO</h6>
      <p className="mb-1">
        El usuario puede ejercer los derechos de Acceso, Rectificacion, Cancelacion y Oposicion
        desde la plataforma o ante la Unidad de Transparencia correspondiente.
      </p>
      <ul>
        <li>
          <strong>Correo:</strong>{' '}
          <a href="mailto:unidadtransparencia@guanajuato.gob.mx">
            unidadtransparencia@guanajuato.gob.mx
          </a>
        </li>
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
      </ul>

      <hr />

      <h6 className="fw-bold text-success">V. Cambios al Aviso</h6>
      <p className="mb-0">
        Cualquier modificacion al Aviso de Privacidad sera publicada por medios electronicos dentro
        de la plataforma.
      </p>
    </div>
  );
}
