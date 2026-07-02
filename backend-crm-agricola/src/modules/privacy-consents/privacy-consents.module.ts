import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PrivacyConsentLogEntity } from './adapters/out/persistence/typeorm/entities/privacy-consent-log.entity'
import { TypeormPrivacyConsentLogRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-privacy-consent-log.repository'
import { PRIVACY_CONSENT_LOG_REPOSITORY_PORT } from './ports/out/privacy-consent-log-repository.port'

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyConsentLogEntity])],
  providers: [
    TypeormPrivacyConsentLogRepository,
    {
      provide: PRIVACY_CONSENT_LOG_REPOSITORY_PORT,
      useExisting: TypeormPrivacyConsentLogRepository,
    },
  ],
  exports: [PRIVACY_CONSENT_LOG_REPOSITORY_PORT],
})
export class PrivacyConsentsModule {}
