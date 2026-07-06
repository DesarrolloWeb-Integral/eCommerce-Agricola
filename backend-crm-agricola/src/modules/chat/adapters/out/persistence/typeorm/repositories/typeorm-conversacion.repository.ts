import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { Conversacion } from '../../../../../domain/entities/conversacion'
import {
  ConversacionRepositoryPort,
  CrearConversacionInput,
} from '../../../../../ports/out/conversacion-repository.port'
import { ConversacionEntity } from '../entities/conversacion.entity'
import { ConversacionMapper } from '../mappers/conversacion.mapper'

@Injectable()
export class TypeormConversacionRepository implements ConversacionRepositoryPort {
  constructor(
    @InjectRepository(ConversacionEntity)
    private readonly repo: Repository<ConversacionEntity>
  ) {}

  async save(input: CrearConversacionInput): Promise<Conversacion> {
    const entity = this.repo.create(input)
    const saved = await this.repo.save(entity)
    return ConversacionMapper.toDomain(saved)
  }

  async findById(id: string): Promise<Conversacion | null> {
    const entity = await this.repo.findOne({ where: { id } })
    return entity ? ConversacionMapper.toDomain(entity) : null
  }

  async findExistente(
    clienteId: string,
    producerProfileId: string,
    productoId: string | null,
    pedidoId: string | null
  ): Promise<Conversacion | null> {
    const entity = await this.repo.findOne({
      where: {
        clienteId,
        producerProfileId,
        productoId: productoId ?? IsNull(),
        pedidoId: pedidoId ?? IsNull(),
      },
    })
    return entity ? ConversacionMapper.toDomain(entity) : null
  }

  async findByClienteId(clienteId: string): Promise<Conversacion[]> {
    const entities = await this.repo.find({
      where: { clienteId },
      order: { updatedAt: 'DESC' },
    })
    return entities.map((entity) => ConversacionMapper.toDomain(entity))
  }

  async findByProducerProfileId(producerProfileId: string): Promise<Conversacion[]> {
    const entities = await this.repo.find({
      where: { producerProfileId },
      order: { updatedAt: 'DESC' },
    })
    return entities.map((entity) => ConversacionMapper.toDomain(entity))
  }
}
