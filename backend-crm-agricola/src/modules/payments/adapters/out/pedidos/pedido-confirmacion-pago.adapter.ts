import { Injectable } from '@nestjs/common'
import { ConfirmarPedidoDesdePagoUseCase } from '../../../../pedidos/application/use-cases/confirmar-pedido-desde-pago.use-case'
import type { PedidoConfirmacionPagoPort } from '../../../ports/out/pedido-confirmacion-pago.port'

@Injectable()
export class PedidoConfirmacionPagoAdapter implements PedidoConfirmacionPagoPort {
  constructor(private readonly confirmarPedidoDesdePagoUseCase: ConfirmarPedidoDesdePagoUseCase) {}

  async confirmarPorPago(pedidoId: string): Promise<void> {
    await this.confirmarPedidoDesdePagoUseCase.execute(pedidoId)
  }
}
