import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import type { SolicitudArco } from '../../../../../domain/entities/solicitud-arco'
import type { EstadoSolicitudArco } from '../../../../../domain/value-objects/estado-solicitud-arco.enum'
import type { TipoSolicitudArco } from '../../../../../domain/value-objects/tipo-solicitud-arco.enum'
import type { SolicitudArcoRepositoryPort } from '../../../../../ports/out/solicitud-arco-repository.port'
import { SolicitudArcoEntity } from '../entities/solicitud-arco.entity'
import { SolicitudArcoMapper } from '../mappers/solicitud-arco.mapper'

@Injectable()
export class TypeormSolicitudArcoRepository implements SolicitudArcoRepositoryPort {
  constructor(
    @InjectRepository(SolicitudArcoEntity)
    private readonly repository: Repository<SolicitudArcoEntity>
  ) {}

  async save(solicitud: SolicitudArco): Promise<SolicitudArco> {
    const entity = SolicitudArcoMapper.toPersistence(solicitud)
    const saved = await this.repository.save(entity)

    return SolicitudArcoMapper.toDomain(saved)
  }

  async findById(id: string): Promise<SolicitudArco | null> {
    const entity = await this.repository.findOneBy({ id })

    return entity ? SolicitudArcoMapper.toDomain(entity) : null
  }

  async findByUserId(userId: string): Promise<SolicitudArco[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { requestedAt: 'DESC' },
    })

    return entities.map((entity) => SolicitudArcoMapper.toDomain(entity))
  }

  async findAll(): Promise<SolicitudArco[]> {
    const entities = await this.repository.find({
      order: { requestedAt: 'DESC' },
    })

    return entities.map((entity) => SolicitudArcoMapper.toDomain(entity))
  }

  async findByUserTypeAndStatuses(
    userId: string,
    type: TipoSolicitudArco,
    statuses: EstadoSolicitudArco[]
  ): Promise<SolicitudArco | null> {
    const entity = await this.repository.findOne({
      where: {
        userId,
        type,
        status: In(statuses),
      },
      order: { requestedAt: 'DESC' },
    })

    return entity ? SolicitudArcoMapper.toDomain(entity) : null
  }

  async findByTypeAndStatuses(
    type: TipoSolicitudArco,
    statuses: EstadoSolicitudArco[]
  ): Promise<SolicitudArco[]> {
    const entities = await this.repository.find({
      where: {
        type,
        status: In(statuses),
      },
      order: { requestedAt: 'ASC' },
    })

    return entities.map((entity) => SolicitudArcoMapper.toDomain(entity))
  }
}
