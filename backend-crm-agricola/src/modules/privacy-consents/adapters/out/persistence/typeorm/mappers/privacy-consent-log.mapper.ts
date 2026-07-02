import { PrivacyConsentLog } from '../../../../../domain/entities/privacy-consent-log'
import { PrivacyConsentLogEntity } from '../entities/privacy-consent-log.entity'

export class PrivacyConsentLogMapper {
  static toDomain(entity: PrivacyConsentLogEntity): PrivacyConsentLog {
    return new PrivacyConsentLog(
      entity.id,
      entity.userId,
      entity.documentType,
      entity.version,
      entity.acceptedAt,
      entity.action,
      entity.createdAt
    )
  }

  static toPersistence(log: PrivacyConsentLog): PrivacyConsentLogEntity {
    const entity = new PrivacyConsentLogEntity()

    entity.id = log.id
    entity.userId = log.userId
    entity.documentType = log.documentType
    entity.version = log.version
    entity.acceptedAt = log.acceptedAt
    entity.action = log.action
    entity.createdAt = log.createdAt

    return entity
  }
}
