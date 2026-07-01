import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from 'mercadopago'
import {
  MercadoPagoWebhookSignaturePort,
  ValidarFirmaWebhookMercadoPagoInput,
} from '../../../ports/out/mercado-pago-webhook-signature.port'

@Injectable()
export class MercadoPagoWebhookSignatureAdapter implements MercadoPagoWebhookSignaturePort {
  private readonly secret: string

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('MERCADO_PAGO_WEBHOOK_SECRET')

    if (!secret) {
      throw new Error('La variable MERCADO_PAGO_WEBHOOK_SECRET es obligatoria.')
    }

    this.secret = secret
  }

  validar(input: ValidarFirmaWebhookMercadoPagoInput): void {
    try {
      WebhookSignatureValidator.validate({
        xSignature: input.xSignature,
        xRequestId: input.xRequestId,
        dataId: input.dataId,
        secret: this.secret,
      })
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        throw new UnauthorizedException('La firma del webhook de Mercado Pago no es válida.')
      }

      throw error
    }
  }
}
