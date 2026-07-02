import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { Usuario } from '../../domain/entities/usuario'
import { EstadoCuenta } from '../../domain/value-objects/estado-cuenta.enum'
import { PASSWORD_HASHER_PORT } from '../../ports/out/password-hasher.port'
import type { PasswordHasherPort } from '../../ports/out/password-hasher.port'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'
import { RolUsuario } from '../../domain/value-objects/rol-usuario.enum'
import { PRIVACY_DOCUMENTS_CONFIG } from 'src/modules/privacy-consents/privacy-documents.config'
import { PrivacyConsentLog } from 'src/modules/privacy-consents/domain/entities/privacy-consent-log'
import { PrivacyConsentAction } from 'src/modules/privacy-consents/domain/value-objects/privacy-consent-action.enum'
import { PrivacyDocumentType } from 'src/modules/privacy-consents/domain/value-objects/privacy-document-type.enum'
import {
  PRIVACY_CONSENT_LOG_REPOSITORY_PORT,
  type PrivacyConsentLogRepositoryPort,
} from 'src/modules/privacy-consents/ports/out/privacy-consent-log-repository.port'

export interface RegistrarUsuarioInput {
  name: string
  lastName: string
  email: string
  phone?: string | null
  password: string
  role: RolUsuario
  privacyNoticeAccepted: boolean
}

@Injectable()
export class RegistrarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(PRIVACY_CONSENT_LOG_REPOSITORY_PORT)
    private readonly privacyConsentLogRepository: PrivacyConsentLogRepositoryPort
  ) {}

  async execute(input: RegistrarUsuarioInput): Promise<Usuario> {
    this.validateRequiredConsents(input)

    const email = input.email.trim().toLowerCase()
    const phone = this.normalizePhone(input.phone)

    await this.validateUniqueData(email, phone)
    this.validatePublicRole(input.role)

    const passwordHash = await this.passwordHasher.hash(input.password)

    const now = new Date()

    const usuario = new Usuario(
      randomUUID(),
      input.name.trim(),
      input.lastName.trim(),
      email,
      phone,
      passwordHash,
      null,
      input.role,
      true,
      EstadoCuenta.ACTIVA,
      null,
      null,
      false,
      null,
      null,
      null,
      null,
      now,
      now,
      null
    )

    usuario.recordPrivacyNoticeConsent({
      acceptedAt: now,
      privacyNoticeVersion: PRIVACY_DOCUMENTS_CONFIG.privacyNoticeVersion,
    })

    const savedUsuario = await this.usuarioRepository.save(usuario)

    await this.privacyConsentLogRepository.save(
      new PrivacyConsentLog(
        randomUUID(),
        savedUsuario.id,
        PrivacyDocumentType.PRIVACY_NOTICE,
        PRIVACY_DOCUMENTS_CONFIG.privacyNoticeVersion,
        now,
        PrivacyConsentAction.ACCEPTED,
        now
      )
    )

    return savedUsuario
  }

  private validateRequiredConsents(input: RegistrarUsuarioInput): void {
    if (input.privacyNoticeAccepted !== true) {
      throw new BadRequestException('Debes aceptar el Aviso de Privacidad para registrarte.')
    }
  }

  private async validateUniqueData(email: string, phone: string | null): Promise<void> {
    const [usuarioConMismoEmail, usuarioConMismoTelefono] = await Promise.all([
      this.usuarioRepository.findByEmailIncludingDeleted(email),
      phone ? this.usuarioRepository.findByPhoneIncludingDeleted(phone) : Promise.resolve(null),
    ])

    if (usuarioConMismoEmail) {
      if (!usuarioConMismoEmail.isActive) {
        throw new ConflictException(
          'Existe una cuenta desactivada con este correo electrónico. Solicita la reactivación de tu cuenta.'
        )
      }

      throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.')
    }

    if (usuarioConMismoTelefono) {
      if (!usuarioConMismoTelefono.isActive) {
        throw new ConflictException(
          'Existe una cuenta desactivada con este número telefónico. Solicita la reactivación de tu cuenta.'
        )
      }

      throw new ConflictException('Ya existe un usuario registrado con este número telefónico.')
    }
  }

  private normalizePhone(phone: string | null | undefined): string | null {
    const normalizedPhone = phone?.trim() ?? ''

    return normalizedPhone.length > 0 ? normalizedPhone : null
  }

  private validatePublicRole(role: RolUsuario): void {
    const allowedRoles = [RolUsuario.CLIENTE, RolUsuario.PROVEEDOR]

    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException('No es posible registrarse con el rol de administrador.')
    }
  }
}
