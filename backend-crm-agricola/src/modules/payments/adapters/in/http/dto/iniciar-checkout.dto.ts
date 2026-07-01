import { Equals, IsBoolean } from 'class-validator'

export class IniciarCheckoutDto {
  @IsBoolean({
    message: 'Debes indicar si aceptas usar Mercado Pago.',
  })
  @Equals(true, {
    message: 'Debes aceptar el uso de Mercado Pago para continuar.',
  })
  acceptedExternalPaymentConsent!: boolean
}
