import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import type { PrivacyConsentLog } from '../../../../../domain/entities/privacy-consent-log'
import type { PrivacyConsentLogRepositoryPort } from '../../../../../ports/out/privacy-consent-log-repository.port'
import { PrivacyConsentLogEntity } from '../entities/privacy-consent-log.entity'
import { PrivacyConsentLogMapper } from '../mappers/privacy-consent-log.mapper'

@Injectable()
export class TypeormPrivacyConsentLogRepository implements PrivacyConsentLogRepositoryPort {
  constructor(
    @InjectRepository(PrivacyConsentLogEntity)
    private readonly repository: Repository<PrivacyConsentLogEntity>
  ) {}

  async save(log: PrivacyConsentLog): Promise<PrivacyConsentLog> {
    const entity = PrivacyConsentLogMapper.toPersistence(log)
    const saved = await this.repository.save(entity)

    return PrivacyConsentLogMapper.toDomain(saved)
  }

  async findByUserId(userId: string): Promise<PrivacyConsentLog[]> {
    const logs = await this.repository.find({
      where: { userId },
      order: { acceptedAt: 'DESC' },
    })

    return logs.map((log) => PrivacyConsentLogMapper.toDomain(log))
  }
}
