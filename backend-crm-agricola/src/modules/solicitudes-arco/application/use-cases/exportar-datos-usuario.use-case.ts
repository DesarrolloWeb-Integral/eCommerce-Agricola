import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import {
  PAGO_REPOSITORY_PORT,
  type PagoRepositoryPort,
} from 'src/modules/payments/ports/out/pago-repository.port'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from 'src/modules/pedidos/ports/out/pedido-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import {
  PRIVACY_CONSENT_LOG_REPOSITORY_PORT,
  type PrivacyConsentLogRepositoryPort,
} from 'src/modules/privacy-consents/ports/out/privacy-consent-log-repository.port'
import { PrivacyDocumentType } from 'src/modules/privacy-consents/domain/value-objects/privacy-document-type.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

export interface ExportacionDatosUsuario {
  generatedAt: Date
  account: {
    id: string
    name: string
    lastName: string
    email: string
    phone: string | null
    role: string
    isActive: boolean
    estadoCuenta: string
    createdAt: Date
    updatedAt: Date
    privacyNoticeAcceptedAt: Date | null
    privacyNoticeVersion: string | null
    optionalPurposesAllowed: boolean
    optionalPurposesUpdatedAt: Date | null
  }
  pedidosComoCliente: {
    id: string
    producerProfileId: string
    items: { productId: string; quantity: number; unitPrice: number; subtotal: number }[]
    subtotal: number
    estado: string
    createdAt: Date
    updatedAt: Date
  }[]
  pedidosComoProductor: {
    id: string
    items: { productId: string; quantity: number; unitPrice: number; subtotal: number }[]
    subtotal: number
    estado: string
    createdAt: Date
    updatedAt: Date
  }[]
  pagosComoCliente: {
    id: string
    pedidoId: string
    subtotal: number
    comision: number
    total: number
    montoProductor: number
    estado: string
    creadoEn: Date
    actualizadoEn: Date
  }[]
  solicitudesArco: {
    id: string
    type: string
    status: string
    reason: string | null
    requestedDataDescription: string | null
    response: string | null
    requestedAt: Date
    resolvedAt: Date | null
  }[]
  consentimientos: {
    id: string
    documentType: string
    version: string
    acceptedAt: Date
    action: string
    createdAt: Date
  }[]
}

@Injectable()
export class ExportarDatosUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,

    @Inject(PAGO_REPOSITORY_PORT)
    private readonly pagoRepository: PagoRepositoryPort,

    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort,

    @Inject(PRIVACY_CONSENT_LOG_REPOSITORY_PORT)
    private readonly consentLogRepository: PrivacyConsentLogRepositoryPort,

    private readonly producerProfileService: ProducerProfileService
  ) {}

  async execute(userId: string): Promise<ExportacionDatosUsuario> {
    const usuario = await this.usuarioRepository.findById(userId)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    const [
      pedidosComoCliente,
      pagosComoCliente,
      solicitudesArco,
      consentimientos,
      producerProfileId,
    ] = await Promise.all([
      this.pedidoRepository.findByClientId(userId),
      this.pagoRepository.findByClientId(userId),
      this.solicitudRepository.findByUserId(userId),
      this.consentLogRepository.findByUserId(userId),
      this.findOwnProducerProfileId(userId),
    ])

    const pedidosComoProductor = producerProfileId
      ? await this.pedidoRepository.findByProducerProfileId(producerProfileId)
      : []

    return {
      generatedAt: new Date(),
      account: {
        id: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        phone: usuario.phone,
        role: usuario.role,
        isActive: usuario.isActive,
        estadoCuenta: usuario.estadoCuenta,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
        privacyNoticeAcceptedAt: usuario.privacyNoticeAcceptedAt,
        privacyNoticeVersion: usuario.privacyNoticeVersion,
        optionalPurposesAllowed: usuario.optionalPurposesAllowed,
        optionalPurposesUpdatedAt: usuario.optionalPurposesUpdatedAt,
      },
      pedidosComoCliente: pedidosComoCliente.map((pedido) => ({
        id: pedido.id,
        producerProfileId: pedido.producerProfileId,
        items: pedido.items,
        subtotal: pedido.subtotal,
        estado: pedido.estado,
        createdAt: pedido.createdAt,
        updatedAt: pedido.updatedAt,
      })),
      pedidosComoProductor: pedidosComoProductor.map((pedido) => ({
        id: pedido.id,
        items: pedido.items,
        subtotal: pedido.subtotal,
        estado: pedido.estado,
        createdAt: pedido.createdAt,
        updatedAt: pedido.updatedAt,
      })),
      pagosComoCliente: pagosComoCliente.map((pago) => ({
        id: pago.id,
        pedidoId: pago.pedidoId,
        subtotal: pago.subtotal,
        comision: pago.comision,
        total: pago.total,
        montoProductor: pago.montoProductor,
        estado: pago.estado,
        creadoEn: pago.creadoEn,
        actualizadoEn: pago.actualizadoEn,
      })),
      solicitudesArco: solicitudesArco.map((solicitud) => ({
        id: solicitud.id,
        type: solicitud.type,
        status: solicitud.status,
        reason: solicitud.reason,
        requestedDataDescription: solicitud.requestedDataDescription,
        response: solicitud.response,
        requestedAt: solicitud.requestedAt,
        resolvedAt: solicitud.resolvedAt,
      })),
      consentimientos: consentimientos
        .filter(
          (consentimiento) => consentimiento.documentType === PrivacyDocumentType.PRIVACY_NOTICE
        )
        .map((consentimiento) => ({
          id: consentimiento.id,
          documentType: consentimiento.documentType,
          version: consentimiento.version,
          acceptedAt: consentimiento.acceptedAt,
          action: consentimiento.action,
          createdAt: consentimiento.createdAt,
        })),
    }
  }

  private async findOwnProducerProfileId(userId: string): Promise<string | null> {
    try {
      const profile = await this.producerProfileService.findOwn(userId)

      return profile.id
    } catch {
      return null
    }
  }
}
