import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  MERCADO_PAGO_PAYMENT_PORT,
  type MercadoPagoPaymentPort,
} from '../../ports/out/mercado-pago-payment.port'
import { PAGO_REPOSITORY_PORT, type PagoRepositoryPort } from '../../ports/out/pago-repository.port'
import {
  PEDIDO_CONFIRMACION_PAGO_PORT,
  type PedidoConfirmacionPagoPort,
} from '../../ports/out/pedido-confirmacion-pago.port'
import { EstadoPago } from '../../domain/value-objects/estado-pago.enum'

@Injectable()
export class ProcesarNotificacionPagoUseCase {
  constructor(
    @Inject(MERCADO_PAGO_PAYMENT_PORT)
    private readonly mercadoPagoPayment: MercadoPagoPaymentPort,
    @Inject(PAGO_REPOSITORY_PORT)
    private readonly pagoRepository: PagoRepositoryPort,
    @Inject(PEDIDO_CONFIRMACION_PAGO_PORT)
    private readonly pedidoConfirmacionPago: PedidoConfirmacionPagoPort
  ) {}

  async execute(paymentId: string): Promise<void> {
    const pagoMercadoPago = await this.mercadoPagoPayment.obtenerPorId(paymentId)

    if (!pagoMercadoPago.externalReference) {
      throw new BadRequestException('El pago de Mercado Pago no contiene una referencia externa.')
    }

    const pago = await this.pagoRepository.findById(pagoMercadoPago.externalReference)

    if (!pago) {
      throw new NotFoundException('No existe un pago local asociado al pago de Mercado Pago.')
    }

    if (pagoMercadoPago.currencyId !== 'MXN') {
      throw new BadRequestException('La moneda del pago de Mercado Pago no es válida.')
    }

    if (
      this.convertirACentavos(pagoMercadoPago.transactionAmount) !==
      this.convertirACentavos(pago.total)
    ) {
      throw new BadRequestException(
        'El monto pagado en Mercado Pago no coincide con el total esperado.'
      )
    }

    if (pago.mercadoPagoPaymentId && pago.mercadoPagoPaymentId !== pagoMercadoPago.id) {
      throw new BadRequestException('El pago local ya está asociado a otro pago de Mercado Pago.')
    }

    if (
      pago.estado !== EstadoPago.PENDIENTE &&
      pago.estado !== EstadoPago.EN_PROCESO &&
      pago.estado !== EstadoPago.APROBADO
    ) {
      return
    }

    if (pagoMercadoPago.status === 'rejected') {
      if (pago.estado === EstadoPago.PENDIENTE || pago.estado === EstadoPago.EN_PROCESO) {
        pago.rechazar(pagoMercadoPago.id)
        await this.pagoRepository.save(pago)
      }

      return
    }

    if (pagoMercadoPago.status !== 'approved') {
      return
    }

    if (pago.estado !== EstadoPago.APROBADO) {
      pago.aprobar(pagoMercadoPago.id)
      await this.pagoRepository.save(pago)
    }

    await this.pedidoConfirmacionPago.confirmarPorPago(pago.pedidoId)
  }

  private convertirACentavos(monto: number): number {
    return Math.round((monto + Number.EPSILON) * 100)
  }
}
