import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Pago } from '../../../../../domain/entities/pago'
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
}
