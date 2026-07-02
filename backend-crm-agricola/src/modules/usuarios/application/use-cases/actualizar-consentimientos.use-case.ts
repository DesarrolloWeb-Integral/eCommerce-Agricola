import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { PrivacyConsentLog } from 'src/modules/privacy-consents/domain/entities/privacy-consent-log'
import { PrivacyConsentAction } from 'src/modules/privacy-consents/domain/value-objects/privacy-consent-action.enum'
import { PrivacyDocumentType } from 'src/modules/privacy-consents/domain/value-objects/privacy-document-type.enum'
import { PRIVACY_DOCUMENTS_CONFIG } from 'src/modules/privacy-consents/privacy-documents.config'
import {
  PRIVACY_CONSENT_LOG_REPOSITORY_PORT,
  type PrivacyConsentLogRepositoryPort,
} from 'src/modules/privacy-consents/ports/out/privacy-consent-log-repository.port'
import type { Usuario } from '../../domain/entities/usuario'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from '../../ports/out/usuario-repository.port'

export interface ActualizarConsentimientosInput {
  userId: string
  privacyNoticeAccepted: boolean
}

@Injectable()
export class ActualizarConsentimientosUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PRIVACY_CONSENT_LOG_REPOSITORY_PORT)
    private readonly privacyConsentLogRepository: PrivacyConsentLogRepositoryPort
  ) {}

  async execute(input: ActualizarConsentimientosInput): Promise<Usuario> {
    if (input.privacyNoticeAccepted !== true) {
      throw new BadRequestException('Debes aceptar el Aviso de Privacidad.')
    }

    const usuario = await this.usuarioRepository.findById(input.userId)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (usuario.isCancelled()) {
      throw new BadRequestException('No es posible actualizar una cuenta cancelada.')
    }

    const now = new Date()

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
}
