import { Inject, Injectable } from '@nestjs/common'

import { Pedido } from '../../domain/entities/pedido'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'

@Injectable()
export class ListarMisPedidosUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort
  ) {}

  async execute(clientId: string): Promise<Pedido[]> {
    return this.pedidoRepository.findByClientId(clientId)
  }
}
