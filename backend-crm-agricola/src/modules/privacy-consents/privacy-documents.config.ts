export const PRIVACY_DOCUMENTS_CONFIG = {
  responsibleName: process.env.PRIVACY_RESPONSIBLE_NAME?.trim() || 'AgroConecta',
  privacyContactEmail: process.env.PRIVACY_CONTACT_EMAIL?.trim() || 'privacidad@agroconecta.local',
  privacyNoticeVersion: process.env.PRIVACY_NOTICE_VERSION?.trim() || '1.0',
  lastUpdatedAt: process.env.PRIVACY_DOCUMENTS_LAST_UPDATED_AT?.trim() || '2026-07-01',
} as const
