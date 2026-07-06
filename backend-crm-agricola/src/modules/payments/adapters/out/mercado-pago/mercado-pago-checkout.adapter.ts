import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MercadoPagoConfig, Preference } from 'mercadopago'

import type {
  CheckoutMercadoPago,
  CrearCheckoutMercadoPagoInput,
  MercadoPagoCheckoutPort,
} from '../../../ports/out/mercado-pago-checkout.port'

const LOCAL_CALLBACK_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])
const RESERVED_CALLBACK_HOSTS = new Set([...LOCAL_CALLBACK_HOSTS, 'servidor'])

@Injectable()
export class MercadoPagoCheckoutAdapter implements MercadoPagoCheckoutPort {
  private readonly preference: Preference
  private readonly webhookUrl: string

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.getRequiredConfig('MERCADO_PAGO_ACCESS_TOKEN')

    this.webhookUrl = this.getRequiredCallbackUrl('MERCADO_PAGO_WEBHOOK_URL')

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

      const checkoutUrl = preference.sandbox_init_point

      if (!preference.id || !checkoutUrl || !this.isHttpsUrl(checkoutUrl)) {
        throw new Error(
          'Mercado Pago no devolvio la informacion necesaria para iniciar el checkout.'
        )
      }

      return {
        preferenceId: preference.id,
        checkoutUrl,
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

  private getRequiredCallbackUrl(key: string): string {
    const value = this.getRequiredConfig(key)

    if (!this.isAllowedThirdPartyCallbackUrl(value)) {
      throw new Error(
        `La variable ${key} debe ser una URL HTTPS publica. Solo se permite loopback en desarrollo local.`
      )
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

    if (![success, failure, pending].every((url) => this.isAllowedThirdPartyCallbackUrl(url))) {
      return null
    }

    return {
      success,
      failure,
      pending,
    }
  }

  private isAllowedThirdPartyCallbackUrl(value: string): boolean {
    try {
      const url = new URL(value)

      if (url.protocol === 'https:' && !RESERVED_CALLBACK_HOSTS.has(url.hostname)) {
        return true
      }

      return this.isLocalDevelopmentCallbackUrl(url)
    } catch {
      return false
    }
  }

  private isLocalDevelopmentCallbackUrl(url: URL): boolean {
    return (
      process.env.NODE_ENV !== 'production' &&
      url.protocol === 'http:' &&
      LOCAL_CALLBACK_HOSTS.has(url.hostname)
    )
  }

  private isHttpsUrl(value: string): boolean {
    try {
      return new URL(value).protocol === 'https:'
    } catch {
      return false
    }
  }
}
