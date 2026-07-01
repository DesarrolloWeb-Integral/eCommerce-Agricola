import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { Pago } from '../../domain/entities/pago'
import { PagoFactory } from '../../domain/services/pago.factory'
import { COMISION_STRATEGY, type ComisionStrategy } from '../../domain/strategies/comision.strategy'
import { EstadoPago } from '../../domain/value-objects/estado-pago.enum'
import {
  MERCADO_PAGO_CHECKOUT_PORT,
  type MercadoPagoCheckoutPort,
} from '../../ports/out/mercado-pago-checkout.port'
import { PAGO_REPOSITORY_PORT, type PagoRepositoryPort } from '../../ports/out/pago-repository.port'
import {
  PEDIDO_CONSULTA_PAGO_PORT,
  type PedidoConsultaPagoPort,
} from '../../ports/out/pedido-consulta-pago.port'
import { EstadoPedido } from '../../../pedidos/domain/value-objects/estado-pedido.enum'

export interface IniciarCheckoutPagoInput {
  pedidoId: string
  clientId: string
  acceptedExternalPaymentConsent: boolean
}

export interface IniciarCheckoutPagoResult {
  pagoId: string
  subtotal: number
  comision: number
  total: number
  montoProductor: number
  checkoutUrl: string
}

@Injectable()
export class IniciarCheckoutPagoUseCase {
  constructor(
    @Inject(PEDIDO_CONSULTA_PAGO_PORT)
    private readonly pedidoConsulta: PedidoConsultaPagoPort,
    @Inject(PAGO_REPOSITORY_PORT)
    private readonly pagoRepository: PagoRepositoryPort,
    @Inject(COMISION_STRATEGY)
    private readonly comisionStrategy: ComisionStrategy,
    @Inject(MERCADO_PAGO_CHECKOUT_PORT)
    private readonly mercadoPagoCheckout: MercadoPagoCheckoutPort
  ) {}

  async execute(input: IniciarCheckoutPagoInput): Promise<IniciarCheckoutPagoResult> {
    if (!input.acceptedExternalPaymentConsent) {
      throw new BadRequestException('Debes aceptar el uso de Mercado Pago para continuar.')
    }

    const pedido = await this.pedidoConsulta.findById(input.pedidoId)

    if (!pedido) {
      throw new NotFoundException('El pedido solicitado no existe.')
    }

    if (pedido.clientId !== input.clientId) {
      throw new ForbiddenException('No tienes permiso para iniciar el pago de este pedido.')
    }

    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo los pedidos pendientes pueden iniciar un pago.')
    }

    const pagoExistente = await this.pagoRepository.findByPedidoId(pedido.id)

    if (pagoExistente && pagoExistente.estado !== EstadoPago.PENDIENTE) {
      throw new BadRequestException('Este pedido ya cuenta con un proceso de pago iniciado.')
    }

    const pago = pagoExistente ?? this.crearPago(pedido)

    return this.crearCheckout(pago)
  }

  private crearPago(pedido: {
    id: string
    clientId: string
    producerProfileId: string
    subtotal: number
  }): Pago {
    const factory = new PagoFactory(this.comisionStrategy)

    return factory.crear({
      id: randomUUID(),
      pedidoId: pedido.id,
      clientId: pedido.clientId,
      producerProfileId: pedido.producerProfileId,
      subtotal: pedido.subtotal,
      consentimientoExternoAceptadoEn: new Date(),
    })
  }

  private async crearCheckout(pago: Pago): Promise<IniciarCheckoutPagoResult> {
    const pagoPendiente = await this.pagoRepository.save(pago)

    const checkout = await this.mercadoPagoCheckout.crearCheckout({
      externalReference: pagoPendiente.id,
      title: 'Pedido agrícola',
      total: pagoPendiente.total,
    })

    pagoPendiente.marcarEnProceso(checkout.preferenceId)

    const pagoEnProceso = await this.pagoRepository.save(pagoPendiente)

    return {
      pagoId: pagoEnProceso.id,
      subtotal: pagoEnProceso.subtotal,
      comision: pagoEnProceso.comision,
      total: pagoEnProceso.total,
      montoProductor: pagoEnProceso.montoProductor,
      checkoutUrl: checkout.checkoutUrl,
    }
  }
}
