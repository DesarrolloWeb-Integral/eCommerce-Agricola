import { BadGatewayException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import type {
  MercadoPagoPaymentPort,
  PagoMercadoPago,
} from '../../../ports/out/mercado-pago-payment.port'

@Injectable()
export class MercadoPagoPaymentAdapter implements MercadoPagoPaymentPort {
  private readonly payment: Payment

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('La variable MERCADO_PAGO_ACCESS_TOKEN es obligatoria.')
    }

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    })

    this.payment = new Payment(client)
  }

  async obtenerPorId(paymentId: string): Promise<PagoMercadoPago> {
    try {
      const pago = await this.payment.get({
        id: paymentId,
      })

      if (
        pago.id === undefined ||
        !pago.status ||
        pago.transaction_amount === undefined ||
        !pago.currency_id
      ) {
        throw new Error('Mercado Pago devolvió información incompleta del pago.')
      }

      return {
        id: String(pago.id),
        status: pago.status,
        externalReference: pago.external_reference ?? null,
        transactionAmount: pago.transaction_amount,
        currencyId: pago.currency_id,
      }
    } catch (error) {
      throw new BadGatewayException('No fue posible consultar el pago en Mercado Pago.', {
        cause: error,
      })
    }
  }
}
