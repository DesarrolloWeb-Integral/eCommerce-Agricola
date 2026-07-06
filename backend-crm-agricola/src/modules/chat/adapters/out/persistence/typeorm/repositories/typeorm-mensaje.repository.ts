import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Mensaje } from '../../../../../domain/entities/mensaje'
import { MensajeRepositoryPort } from '../../../../../ports/out/mensaje-repository.port'
import { MensajeEntity } from '../entities/mensaje.entity'
import { MensajeMapper } from '../mappers/mensaje.mapper'

@Injectable()
export class TypeormMensajeRepository implements MensajeRepositoryPort {
  constructor(
    @InjectRepository(MensajeEntity)
    private readonly repo: Repository<MensajeEntity>
  ) {}

  async save(conversacionId: string, remitenteId: string, contenido: string): Promise<Mensaje> {
    const entity = this.repo.create({ conversacionId, remitenteId, contenido })
    const saved = await this.repo.save(entity)
    return MensajeMapper.toDomain(saved)
  }

  async findByConversacionId(conversacionId: string): Promise<Mensaje[]> {
    const entities = await this.repo.find({
      where: { conversacionId },
      order: { createdAt: 'ASC' },
    })
    return entities.map((entity) => MensajeMapper.toDomain(entity))
  }
}
