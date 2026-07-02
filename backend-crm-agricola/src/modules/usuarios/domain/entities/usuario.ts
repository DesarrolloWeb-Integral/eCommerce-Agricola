import { RolUsuario } from '../value-objects/rol-usuario.enum'
import { EstadoCuenta } from '../value-objects/estado-cuenta.enum'

export class Usuario {
  constructor(
    public readonly id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public phone: string | null,
    public passwordHash: string,
    public refreshTokenHash: string | null,
    public role: RolUsuario,
    public isActive: boolean,
    public estadoCuenta: EstadoCuenta,
    public privacyNoticeAcceptedAt: Date | null,
    public privacyNoticeVersion: string | null,
    public optionalPurposesAllowed: boolean,
    public optionalPurposesUpdatedAt: Date | null,
    public cancellationRequestedAt: Date | null,
    public cancelledAt: Date | null,
    public personalDataDisassociatedAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}

  deactivate(): void {
    this.isActive = false
    this.deletedAt = new Date()
  }

  isCancelled(): boolean {
    return this.estadoCuenta === EstadoCuenta.CANCELADA
  }

  updateProfile({
    name,
    lastName,
    email,
    phone,
  }: {
    name?: string
    lastName?: string
    email?: string
    phone?: string | null
  }): void {
    if (name !== undefined) {
      this.name = name
    }

    if (lastName !== undefined) {
      this.lastName = lastName
    }

    if (email !== undefined) {
      this.email = email
    }

    if (phone !== undefined) {
      this.phone = phone
    }

    this.updatedAt = new Date()
  }

  recordPrivacyNoticeConsent({
    acceptedAt,
    privacyNoticeVersion,
  }: {
    acceptedAt: Date
    privacyNoticeVersion: string
  }): void {
    this.privacyNoticeAcceptedAt = acceptedAt
    this.privacyNoticeVersion = privacyNoticeVersion
    this.optionalPurposesAllowed = false
    this.optionalPurposesUpdatedAt = null
    this.updatedAt = new Date()
  }

  disableOptionalPurposes(updatedAt: Date): void {
    this.optionalPurposesAllowed = false
    this.optionalPurposesUpdatedAt = updatedAt
    this.updatedAt = updatedAt
  }

  markCancellationPending(requestedAt: Date): void {
    this.estadoCuenta = EstadoCuenta.CANCELACION_PENDIENTE
    this.cancellationRequestedAt = requestedAt
    this.updatedAt = requestedAt
  }

  keepAccount(updatedAt: Date): void {
    this.estadoCuenta = EstadoCuenta.ACTIVA
    this.isActive = true
    this.cancellationRequestedAt = null
    this.updatedAt = updatedAt
  }

  disassociatePersonalIdentifiers({
    name,
    lastName,
    email,
    phone,
    passwordHash,
    cancelledAt,
  }: {
    name: string
    lastName: string
    email: string
    phone: string
    passwordHash: string
    cancelledAt: Date
  }): void {
    this.name = name
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.passwordHash = passwordHash
    this.refreshTokenHash = null
    this.isActive = false
    this.estadoCuenta = EstadoCuenta.CANCELADA
    this.cancellationRequestedAt = this.cancellationRequestedAt ?? cancelledAt
    this.cancelledAt = cancelledAt
    this.personalDataDisassociatedAt = cancelledAt
    this.updatedAt = cancelledAt
  }

  updateRefreshTokenHash(refreshTokenHash: string): void {
    this.refreshTokenHash = refreshTokenHash
    this.updatedAt = new Date()
  }

  clearRefreshTokenHash(): void {
    this.refreshTokenHash = null
    this.updatedAt = new Date()
  }
}
