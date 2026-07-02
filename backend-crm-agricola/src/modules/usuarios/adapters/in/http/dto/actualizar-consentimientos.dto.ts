import { IsBoolean } from 'class-validator'

export class ActualizarConsentimientosDto {
  @IsBoolean({ message: 'Debes aceptar el Aviso de Privacidad.' })
  privacyNoticeAccepted!: boolean
}
