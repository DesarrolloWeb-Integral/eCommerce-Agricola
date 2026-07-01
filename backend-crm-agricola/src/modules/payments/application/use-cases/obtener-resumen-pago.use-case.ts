import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { COMISION_STRATEGY, type ComisionStrategy } from '../../domain/strategies/comision.strategy'
import { EstadoPedido } from '../../../pedidos/domain/value-objects/estado-pedido.enum'
import {
  PEDIDO_CONSULTA_PAGO_PORT,
  type PedidoConsultaPagoPort,
} from '../../ports/out/pedido-consulta-pago.port'

export interface ObtenerResumenPagoInput {
  pedidoId: string
  clientId: string
}

export interface ResumenPago {
  pedidoId: string
  subtotal: number
  comision: number
  total: number
  montoProductor: number
}

@Injectable()
export class ObtenerResumenPagoUseCase {
  constructor(
    @Inject(PEDIDO_CONSULTA_PAGO_PORT)
    private readonly pedidoConsulta: PedidoConsultaPagoPort,
    @Inject(COMISION_STRATEGY)
    private readonly comisionStrategy: ComisionStrategy
  ) {}

  async execute(input: ObtenerResumenPagoInput): Promise<ResumenPago> {
    const pedido = await this.pedidoConsulta.findById(input.pedidoId)

    if (!pedido) {
      throw new NotFoundException('El pedido solicitado no existe.')
    }

    if (pedido.clientId !== input.clientId) {
      throw new ForbiddenException('No tienes permiso para consultar el pago de este pedido.')
    }

    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo los pedidos pendientes pueden iniciar un pago.')
    }

    const comision = this.comisionStrategy.calcular(pedido.subtotal)

    return {
      pedidoId: pedido.id,
      subtotal: pedido.subtotal,
      comision,
      total: pedido.subtotal,
      montoProductor: this.redondear(pedido.subtotal - comision),
    }
  }

  private redondear(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100
  }
}
