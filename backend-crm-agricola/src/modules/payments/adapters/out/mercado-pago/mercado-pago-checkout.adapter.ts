import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MercadoPagoConfig, Preference } from 'mercadopago'

import type {
  CheckoutMercadoPago,
  CrearCheckoutMercadoPagoInput,
  MercadoPagoCheckoutPort,
} from '../../../ports/out/mercado-pago-checkout.port'

@Injectable()
export class MercadoPagoCheckoutAdapter implements MercadoPagoCheckoutPort {
  private readonly preference: Preference
  private readonly webhookUrl: string

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.getRequiredConfig('MERCADO_PAGO_ACCESS_TOKEN')

    this.webhookUrl = this.getRequiredConfig('MERCADO_PAGO_WEBHOOK_URL')

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    })

    this.preference = new Preference(client)
  }

  async crearCheckout(input: CrearCheckoutMercadoPagoInput): Promise<CheckoutMercadoPago> {
    try {
      const backUrls = this.getBackUrls()

      const preference = await this.preference.create({
        body: {
          external_reference: input.externalReference,
          notification_url: this.webhookUrl,
          ...(backUrls
            ? {
                back_urls: backUrls,
                auto_return: 'approved',
              }
            : {}),
          items: [
            {
              id: `pago-${input.externalReference}`,
              title: input.title,
              quantity: 1,
              unit_price: input.total,
              currency_id: 'MXN',
            },
          ],
        },
      })

      if (!preference.id || !preference.sandbox_init_point) {
        throw new Error(
          'Mercado Pago no devolvio la informacion necesaria para iniciar el checkout.'
        )
      }

      return {
        preferenceId: preference.id,
        checkoutUrl: preference.sandbox_init_point,
      }
    } catch (error) {
      throw new InternalServerErrorException('No fue posible crear el checkout de Mercado Pago.', {
        cause: error,
      })
    }
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key)?.trim()

    if (!value) {
      throw new Error(`La variable ${key} no esta configurada.`)
    }

    return value
  }

  private getBackUrls(): { success: string; failure: string; pending: string } | null {
    const success = this.configService.get<string>('MERCADO_PAGO_SUCCESS_URL')?.trim()
    const failure = this.configService.get<string>('MERCADO_PAGO_FAILURE_URL')?.trim()
    const pending = this.configService.get<string>('MERCADO_PAGO_PENDING_URL')?.trim()

    if (!success || !failure || !pending) {
      return null
    }

    if (![success, failure, pending].every((url) => this.isPublicHttpsUrl(url))) {
      return null
    }

    return {
      success,
      failure,
      pending,
    }
  }

  private isPublicHttpsUrl(value: string): boolean {
    try {
      const url = new URL(value)
      const invalidHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'servidor'])

      return url.protocol === 'https:' && !invalidHosts.has(url.hostname)
    } catch {
      return false
    }
  }
}
