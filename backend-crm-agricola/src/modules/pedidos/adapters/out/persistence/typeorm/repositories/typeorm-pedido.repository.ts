import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Pedido } from '../../../../../domain/entities/pedido'
import { PedidoRepositoryPort } from '../../../../../ports/out/pedido-repository.port'
import { PedidoEntity } from '../entities/pedido.entity'
import { PedidoMapper } from '../mappers/pedido.mapper'

@Injectable()
export class TypeormPedidoRepository implements PedidoRepositoryPort {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>
  ) {}

  async save(pedido: Pedido): Promise<Pedido> {
    const pedidoEntity = PedidoMapper.toEntity(pedido)

    const pedidoGuardado = await this.pedidoRepository.save(pedidoEntity)

    return PedidoMapper.toDomain(pedidoGuardado)
  }

  async findById(id: string): Promise<Pedido | null> {
    const pedidoEntity = await this.pedidoRepository.findOne({
      where: { id },
    })

    return pedidoEntity ? PedidoMapper.toDomain(pedidoEntity) : null
  }

  async findByClientId(clientId: string): Promise<Pedido[]> {
    const pedidos = await this.pedidoRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    })

    return pedidos.map((pedido) => PedidoMapper.toDomain(pedido))
  }

  async findByProducerProfileId(producerProfileId: string): Promise<Pedido[]> {
    const pedidos = await this.pedidoRepository.find({
      where: { producerProfileId },
      order: { createdAt: 'DESC' },
    })

    return pedidos.map((pedido) => PedidoMapper.toDomain(pedido))
  }
}
