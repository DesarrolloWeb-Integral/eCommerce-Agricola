import type { PrivacyConsentLog } from '../../domain/entities/privacy-consent-log'

export const PRIVACY_CONSENT_LOG_REPOSITORY_PORT = Symbol('PRIVACY_CONSENT_LOG_REPOSITORY_PORT')

export interface PrivacyConsentLogRepositoryPort {
  save(log: PrivacyConsentLog): Promise<PrivacyConsentLog>
  findByUserId(userId: string): Promise<PrivacyConsentLog[]>
}
