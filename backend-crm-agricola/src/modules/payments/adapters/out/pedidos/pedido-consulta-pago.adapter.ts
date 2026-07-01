import { Inject, Injectable } from '@nestjs/common'

import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from 'src/modules/pedidos/ports/out/pedido-repository.port'
import type {
  PedidoConsultaPagoPort,
  PedidoParaPago,
} from '../../../ports/out/pedido-consulta-pago.port'

@Injectable()
export class PedidoConsultaPagoAdapter implements PedidoConsultaPagoPort {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort
  ) {}

  async findById(id: string): Promise<PedidoParaPago | null> {
    const pedido = await this.pedidoRepository.findById(id)

    if (!pedido) {
      return null
    }

    return {
      id: pedido.id,
      clientId: pedido.clientId,
      producerProfileId: pedido.producerProfileId,
      subtotal: pedido.subtotal,
      estado: pedido.estado,
    }
  }
}
