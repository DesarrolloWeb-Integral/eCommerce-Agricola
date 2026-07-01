import { Controller, Headers, HttpCode, Inject, Post, Query } from '@nestjs/common'
import { ProcesarNotificacionPagoUseCase } from '../../../../application/use-cases/procesar-notificacion-pago.use-case'
import {
  MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT,
  type MercadoPagoWebhookSignaturePort,
} from '../../../../ports/out/mercado-pago-webhook-signature.port'

@Controller('webhooks/mercado-pago')
export class MercadoPagoWebhookController {
  constructor(
    @Inject(MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT)
    private readonly webhookSignature: MercadoPagoWebhookSignaturePort,
    private readonly procesarNotificacionPagoUseCase: ProcesarNotificacionPagoUseCase
  ) {}

  @Post()
  @HttpCode(200)
  async recibirNotificacion(
    @Query('data.id') dataId: string | undefined,
    @Headers('x-signature') signature: string | undefined,
    @Headers('x-request-id') requestId: string | undefined
  ) {
    this.webhookSignature.validar({
      xSignature: signature,
      xRequestId: requestId,
      dataId,
    })

    if (dataId) {
      await this.procesarNotificacionPagoUseCase.execute(dataId)
    }

    return { received: true }
  }
}
