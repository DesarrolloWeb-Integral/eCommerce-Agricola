import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'
import { RegistrarLogUseCase } from '../../../auditoria/application/use-cases/registrar-log.use-case'

@Injectable()
export class ConfirmarPedidoDesdePagoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,
    private readonly eventEmitter: EventEmitter2,
    private readonly registrarLogUseCase: RegistrarLogUseCase
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

    const estadoAnterior = pedido.estado
    pedido.confirmar()

    await this.pedidoRepository.save(pedido)

    this.eventEmitter.emit('pedido.confirmado', pedido)

    await this.registrarLogUseCase.execute({
      usuarioId: pedido.clientId,
      accion: 'CAMBIO_ESTADO_PEDIDO',
      recursoAfectado: `Pedido:${pedido.id}`,
      detalle: `Pedido confirmado automáticamente por pasarela de pago exitosa. Estado: ${estadoAnterior} -> ${pedido.estado}`,
    })
  }
}
