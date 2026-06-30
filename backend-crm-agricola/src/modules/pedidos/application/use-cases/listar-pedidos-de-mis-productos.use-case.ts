import { Inject, Injectable } from '@nestjs/common'

import { Pedido } from '../../domain/entities/pedido'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'

@Injectable()
export class ListarPedidosDeMisProductosUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort
  ) {}

  async execute(producerProfileId: string): Promise<Pedido[]> {
    return this.pedidoRepository.findByProducerProfileId(producerProfileId)
  }
}
