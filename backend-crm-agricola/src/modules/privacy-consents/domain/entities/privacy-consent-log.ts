import { PrivacyConsentAction } from '../value-objects/privacy-consent-action.enum'
import { PrivacyDocumentType } from '../value-objects/privacy-document-type.enum'

export class PrivacyConsentLog {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly documentType: PrivacyDocumentType,
    public readonly version: string,
    public readonly acceptedAt: Date,
    public readonly action: PrivacyConsentAction,
    public readonly createdAt: Date
  ) {}
}
