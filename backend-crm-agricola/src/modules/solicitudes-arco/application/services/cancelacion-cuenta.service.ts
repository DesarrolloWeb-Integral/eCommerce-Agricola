import { Inject, Injectable } from '@nestjs/common'
import { createHash, randomUUID } from 'node:crypto'

import { EstadoPago } from 'src/modules/payments/domain/value-objects/estado-pago.enum'
import {
  PAGO_REPOSITORY_PORT,
  type PagoRepositoryPort,
} from 'src/modules/payments/ports/out/pago-repository.port'
import { EstadoPedido } from 'src/modules/pedidos/domain/value-objects/estado-pedido.enum'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from 'src/modules/pedidos/ports/out/pedido-repository.port'
import type { Usuario } from 'src/modules/usuarios/domain/entities/usuario'
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from 'src/modules/usuarios/ports/out/password-hasher.port'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { SolicitudArco } from '../../domain/entities/solicitud-arco'
import { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../../domain/value-objects/tipo-solicitud-arco.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

@Injectable()
export class CancelacionCuentaService {
  private readonly activeOrderStatuses = [EstadoPedido.PENDIENTE]
  private readonly activePaymentStatuses = [EstadoPago.PENDIENTE, EstadoPago.EN_PROCESO]
  private readonly pendingCancellationStatuses = [
    EstadoSolicitudArco.RECIBIDA,
    EstadoSolicitudArco.EN_REVISION,
    EstadoSolicitudArco.PENDIENTE_POR_OBLIGACIONES,
  ]

  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort,

    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,

    @Inject(PAGO_REPOSITORY_PORT)
    private readonly pagoRepository: PagoRepositoryPort,

    private readonly producerProfileService: ProducerProfileService
  ) {}

  async countActiveObligations(userId: string): Promise<number> {
    const producerProfileId = await this.findOwnProducerProfileId(userId)

    const [clientOrders, clientPayments, producerOrders, producerPayments] = await Promise.all([
      this.pedidoRepository.findByClientIdAndEstados(userId, this.activeOrderStatuses),
      this.pagoRepository.findByClientIdAndEstados(userId, this.activePaymentStatuses),
      producerProfileId
        ? this.pedidoRepository.findByProducerProfileIdAndEstados(
            producerProfileId,
            this.activeOrderStatuses
          )
        : Promise.resolve([]),
      producerProfileId
        ? this.pagoRepository.findByProducerProfileIdAndEstados(
            producerProfileId,
            this.activePaymentStatuses
          )
        : Promise.resolve([]),
    ])

    return (
      clientOrders.length + clientPayments.length + producerOrders.length + producerPayments.length
    )
  }

  async findPendingCancellationRequest(userId: string): Promise<SolicitudArco | null> {
    return this.solicitudRepository.findByUserTypeAndStatuses(
      userId,
      TipoSolicitudArco.CANCELACION,
      this.pendingCancellationStatuses
    )
  }

  async completeCancellation(
    usuario: Usuario,
    now: Date = new Date()
  ): Promise<{ usuario: Usuario; solicitud: SolicitudArco }> {
    const solicitud =
      (await this.findPendingCancellationRequest(usuario.id)) ??
      this.createCancellationRequest(usuario.id, now)

    solicitud.markAutomaticFulfillment(
      'La cuenta fue cancelada y los identificadores personales directos fueron disociados.',
      now
    )

    usuario.disassociatePersonalIdentifiers({
      name: 'Usuario',
      lastName: 'cancelado',
      email: `cancelado-${usuario.id}@anon.invalid`,
      phone: this.createAnonymousPhone(usuario.id),
      passwordHash: await this.passwordHasher.hash(randomUUID()),
      cancelledAt: now,
    })

    const savedSolicitud = await this.solicitudRepository.save(solicitud)
    const savedUsuario = await this.usuarioRepository.save(usuario)

    return {
      usuario: savedUsuario,
      solicitud: savedSolicitud,
    }
  }

  private createCancellationRequest(userId: string, now: Date): SolicitudArco {
    return new SolicitudArco(
      randomUUID(),
      userId,
      TipoSolicitudArco.CANCELACION,
      EstadoSolicitudArco.RECIBIDA,
      'Solicitud de cancelacion de cuenta.',
      'Cancelacion de cuenta y disociacion de identificadores personales directos.',
      null,
      now,
      null,
      null,
      now,
      now
    )
  }

  private async findOwnProducerProfileId(userId: string): Promise<string | null> {
    try {
      const profile = await this.producerProfileService.findOwn(userId)

      return profile.id
    } catch {
      return null
    }
  }

  private createAnonymousPhone(userId: string): string {
    const hash = createHash('sha256').update(userId).digest()
    const digits = Array.from(hash)
      .map((value) => String(value % 10))
      .join('')
      .slice(0, 9)

    return `9${digits}`
  }
}
