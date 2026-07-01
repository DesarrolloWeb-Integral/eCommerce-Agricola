import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Pedido } from '../../domain/entities/pedido'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PedidoConfirmadoEvent } from '../../domain/events/pedido-confirmado.event'

export interface ConfirmarPedidoInput {
  pedidoId: string
  producerProfileId: string
}

@Injectable()
export class ConfirmarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(input: ConfirmarPedidoInput): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findById(input.pedidoId)

    if (!pedido) {
      throw new NotFoundException('El pedido solicitado no existe.')
    }

    if (pedido.producerProfileId !== input.producerProfileId) {
      throw new ForbiddenException('No tienes permiso para confirmar este pedido.')
    }

    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo los pedidos pendientes pueden confirmarse.')
    }

    pedido.confirmar()

    const pedidoConfirmado = await this.pedidoRepository.save(pedido)

    this.eventEmitter.emit(
      'pedido.confirmado',
      new PedidoConfirmadoEvent(
        pedidoConfirmado.id,
        pedidoConfirmado.clientId,
        pedidoConfirmado.producerProfileId,
        pedidoConfirmado.items,
        pedidoConfirmado.subtotal,
        pedidoConfirmado.updatedAt
      )
    )

    return pedidoConfirmado
  }
}
