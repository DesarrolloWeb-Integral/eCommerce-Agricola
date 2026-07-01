import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'

@Injectable()
export class ConfirmarPedidoDesdePagoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(pedidoId: string): Promise<void> {
    const pedido = await this.pedidoRepository.findById(pedidoId)

    if (!pedido) {
      throw new NotFoundException('El pedido no existe.')
    }

    if (pedido.estado === EstadoPedido.CONFIRMADO) {
      return
    }

    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo es posible confirmar pedidos pendientes.')
    }

    pedido.confirmar()

    await this.pedidoRepository.save(pedido)

    this.eventEmitter.emit('pedido.confirmado', pedido)
  }
}
