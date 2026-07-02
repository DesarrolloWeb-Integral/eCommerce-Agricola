import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from 'src/modules/usuarios/ports/out/password-hasher.port'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { CancelacionCuentaService } from '../services/cancelacion-cuenta.service'
import { SolicitudArco } from '../../domain/entities/solicitud-arco'
import { EstadoSolicitudArco } from '../../domain/value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../../domain/value-objects/tipo-solicitud-arco.enum'
import {
  SOLICITUD_ARCO_REPOSITORY_PORT,
  type SolicitudArcoRepositoryPort,
} from '../../ports/out/solicitud-arco-repository.port'

export interface SolicitarCancelacionCuentaInput {
  userId: string
  currentPassword: string
  confirmCancellation: boolean
}

export interface SolicitarCancelacionCuentaResult {
  message: string
  solicitud: SolicitudArco
  accountCancelled: boolean
}

@Injectable()
export class SolicitarCancelacionCuentaUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(SOLICITUD_ARCO_REPOSITORY_PORT)
    private readonly solicitudRepository: SolicitudArcoRepositoryPort,

    private readonly cancelacionCuentaService: CancelacionCuentaService
  ) {}

  async execute(input: SolicitarCancelacionCuentaInput): Promise<SolicitarCancelacionCuentaResult> {
    if (input.confirmCancellation !== true) {
      throw new BadRequestException('Debes confirmar la cancelacion de la cuenta.')
    }

    const usuario = await this.usuarioRepository.findById(input.userId)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (usuario.isCancelled()) {
      throw new ConflictException('La cuenta ya fue cancelada.')
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.currentPassword,
      usuario.passwordHash
    )

    if (!passwordMatches) {
      throw new UnauthorizedException('La contrasena actual no es correcta.')
    }

    const now = new Date()
    const pendingCancellation = await this.cancelacionCuentaService.findPendingCancellationRequest(
      usuario.id
    )

    const obligations = await this.cancelacionCuentaService.countActiveObligations(usuario.id)

    if (obligations > 0) {
      if (!pendingCancellation) {
        await this.solicitudRepository.save(
          new SolicitudArco(
            randomUUID(),
            usuario.id,
            TipoSolicitudArco.CANCELACION,
            EstadoSolicitudArco.PENDIENTE_POR_OBLIGACIONES,
            'Solicitud de cancelacion de cuenta.',
            'Cancelacion de cuenta con operaciones activas pendientes.',
            'La cuenta no se cancelo porque existen pedidos o pagos pendientes.',
            now,
            null,
            null,
            now,
            now
          )
        )
      }

      usuario.markCancellationPending(now)
      await this.usuarioRepository.save(usuario)

      throw new ConflictException(
        `No es posible cancelar la cuenta todavia. Existen ${obligations} operacion(es) pendiente(s).`
      )
    }

    const { solicitud } = await this.cancelacionCuentaService.completeCancellation(usuario, now)

    return {
      message: 'Tu cuenta fue cancelada y tu sesion se cerro correctamente.',
      solicitud,
      accountCancelled: true,
    }
  }
}
