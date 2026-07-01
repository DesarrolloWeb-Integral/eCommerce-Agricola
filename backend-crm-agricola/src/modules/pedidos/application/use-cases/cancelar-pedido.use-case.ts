import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Pedido } from '../../domain/entities/pedido'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'
import {
  PRODUCTO_CONSULTA_PORT,
  type ProductoConsultaPort,
} from '../../ports/out/producto-consulta.port'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'

export interface CancelarPedidoInput {
  pedidoId: string
  clientId: string
}

@Injectable()
export class CancelarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,
    @Inject(PRODUCTO_CONSULTA_PORT)
    private readonly productoConsulta: ProductoConsultaPort
  ) {}

  async execute(input: CancelarPedidoInput): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findById(input.pedidoId)

    if (!pedido) {
      throw new NotFoundException('El pedido solicitado no existe.')
    }

    if (pedido.clientId !== input.clientId) {
      throw new ForbiddenException('No tienes permiso para cancelar este pedido.')
    }

    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo los pedidos pendientes pueden cancelarse.')
    }

    pedido.cancelar()

    const pedidoCancelado = await this.pedidoRepository.save(pedido)

    await Promise.all(
      pedidoCancelado.items.map((item) =>
        this.productoConsulta.liberarStock(item.productId, item.quantity)
      )
    )

    return pedidoCancelado
  }
}
