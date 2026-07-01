import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { PedidoConfirmadoEvent } from '../../domain/events/pedido-confirmado.event'

@Injectable()
export class RegistrarPedidoConfirmadoHandler {
  private readonly logger = new Logger(RegistrarPedidoConfirmadoHandler.name)

  @OnEvent('pedido.confirmado')
  handle(event: PedidoConfirmadoEvent): void {
    this.logger.log(
      `Pedido confirmado: ${event.pedidoId}. Cliente: ${event.clientId}. Productos: ${event.items.length}.`
    )
  }
}
