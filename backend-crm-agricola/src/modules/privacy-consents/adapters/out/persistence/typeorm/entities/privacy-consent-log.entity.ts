import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { PrivacyConsentAction } from '../../../../../domain/value-objects/privacy-consent-action.enum'
import { PrivacyDocumentType } from '../../../../../domain/value-objects/privacy-document-type.enum'

@Entity({ name: 'privacy_consent_log' })
export class PrivacyConsentLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string

  @Column({
    type: 'enum',
    enum: PrivacyDocumentType,
    enumName: 'privacy_document_type_enum',
    name: 'document_type',
  })
  documentType!: PrivacyDocumentType

  @Column({ type: 'varchar', length: 30 })
  version!: string

  @Column({ type: 'timestamp with time zone', name: 'accepted_at' })
  acceptedAt!: Date

  @Column({
    type: 'enum',
    enum: PrivacyConsentAction,
    enumName: 'privacy_consent_action_enum',
    default: PrivacyConsentAction.ACCEPTED,
  })
  action!: PrivacyConsentAction

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
