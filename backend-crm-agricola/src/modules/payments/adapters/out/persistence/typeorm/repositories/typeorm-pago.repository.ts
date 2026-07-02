import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Pago } from '../../../../../domain/entities/pago'
import { EstadoPago } from '../../../../../domain/value-objects/estado-pago.enum'
import { PagoRepositoryPort } from '../../../../../ports/out/pago-repository.port'
import { PagoEntity } from '../entities/pago.entity'
import { PagoMapper } from '../mappers/pago.mapper'

@Injectable()
export class TypeormPagoRepository implements PagoRepositoryPort {
  constructor(
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>
  ) {}

  async save(pago: Pago): Promise<Pago> {
    const pagoEntity = PagoMapper.toEntity(pago)
    const pagoGuardado = await this.pagoRepository.save(pagoEntity)

    return PagoMapper.toDomain(pagoGuardado)
  }

  async findById(id: string): Promise<Pago | null> {
    const pagoEntity = await this.pagoRepository.findOne({
      where: { id },
    })

    return pagoEntity ? PagoMapper.toDomain(pagoEntity) : null
  }

  async findByPedidoId(pedidoId: string): Promise<Pago | null> {
    const pagoEntity = await this.pagoRepository.findOne({
      where: { pedidoId },
    })

    return pagoEntity ? PagoMapper.toDomain(pagoEntity) : null
  }

  async findByMercadoPagoPaymentId(mercadoPagoPaymentId: string): Promise<Pago | null> {
    const pagoEntity = await this.pagoRepository.findOne({
      where: { mercadoPagoPaymentId },
    })

    return pagoEntity ? PagoMapper.toDomain(pagoEntity) : null
  }

  async findByClientId(clientId: string): Promise<Pago[]> {
    const entities = await this.pagoRepository.find({
      where: { clientId },
      order: { creadoEn: 'DESC' },
    })

    return entities.map((entity) => PagoMapper.toDomain(entity))
  }

  async findByProducerProfileId(producerProfileId: string): Promise<Pago[]> {
    const entities = await this.pagoRepository.find({
      where: { producerProfileId },
      order: { creadoEn: 'DESC' },
    })

    return entities.map((entity) => PagoMapper.toDomain(entity))
  }

  async findByClientIdAndEstados(clientId: string, estados: EstadoPago[]): Promise<Pago[]> {
    const entities = await this.pagoRepository.find({
      where: { clientId, estado: In(estados) },
      order: { creadoEn: 'DESC' },
    })

    return entities.map((entity) => PagoMapper.toDomain(entity))
  }

  async findByProducerProfileIdAndEstados(
    producerProfileId: string,
    estados: EstadoPago[]
  ): Promise<Pago[]> {
    const entities = await this.pagoRepository.find({
      where: { producerProfileId, estado: In(estados) },
      order: { creadoEn: 'DESC' },
    })

    return entities.map((entity) => PagoMapper.toDomain(entity))
  }
}
