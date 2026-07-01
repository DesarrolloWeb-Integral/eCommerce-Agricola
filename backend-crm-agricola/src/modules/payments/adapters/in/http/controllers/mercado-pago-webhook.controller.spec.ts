import type { MercadoPagoWebhookSignaturePort } from '../../../../ports/out/mercado-pago-webhook-signature.port'
import { ProcesarNotificacionPagoUseCase } from '../../../../application/use-cases/procesar-notificacion-pago.use-case'
import { MercadoPagoWebhookController } from './mercado-pago-webhook.controller'

describe('MercadoPagoWebhookController', () => {
  const validar = jest.fn()
  const execute = jest.fn()

  const webhookSignature = {
    validar,
  } as unknown as MercadoPagoWebhookSignaturePort

  const procesarNotificacionPagoUseCase = {
    execute,
  } as unknown as ProcesarNotificacionPagoUseCase

  const controller = new MercadoPagoWebhookController(
    webhookSignature,
    procesarNotificacionPagoUseCase
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe validar la firma, procesar el pago y responder que recibió la notificación', async () => {
    execute.mockResolvedValue(undefined)

    const resultado = await controller.recibirNotificacion(
      '123456',
      'ts=123,v1=firma',
      'request-id'
    )

    expect(validar).toHaveBeenCalledWith({
      xSignature: 'ts=123,v1=firma',
      xRequestId: 'request-id',
      dataId: '123456',
    })

    expect(execute).toHaveBeenCalledWith('123456')

    expect(resultado).toEqual({
      received: true,
    })
  })
})
