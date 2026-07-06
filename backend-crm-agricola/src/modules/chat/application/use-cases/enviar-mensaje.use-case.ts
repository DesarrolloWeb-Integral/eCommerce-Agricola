import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Mensaje } from '../../domain/entities/mensaje'
import {
  CONVERSACION_REPOSITORY_PORT,
  type ConversacionRepositoryPort,
} from '../../ports/out/conversacion-repository.port'
import {
  MENSAJE_REPOSITORY_PORT,
  type MensajeRepositoryPort,
} from '../../ports/out/mensaje-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'

export interface EnviarMensajeInput {
  conversacionId: string
  remitenteId: string
  contenido: string
}

@Injectable()
export class EnviarMensajeUseCase {
  constructor(
    @Inject(CONVERSACION_REPOSITORY_PORT)
    private readonly conversacionRepository: ConversacionRepositoryPort,
    @Inject(MENSAJE_REPOSITORY_PORT)
    private readonly mensajeRepository: MensajeRepositoryPort,
    private readonly producerProfileService: ProducerProfileService
  ) {}

  async execute(input: EnviarMensajeInput): Promise<Mensaje> {
    const conversacion = await this.conversacionRepository.findById(input.conversacionId)

    if (!conversacion) {
      throw new NotFoundException('La conversacion solicitada no existe.')
    }

    await this.verificarPertenencia(conversacion, input.remitenteId)

    return this.mensajeRepository.save(conversacion.id, input.remitenteId, input.contenido)
  }

  private async verificarPertenencia(
    conversacion: { clienteId: string; producerProfileId: string },
    usuarioId: string
  ): Promise<void> {
    if (conversacion.clienteId === usuarioId) return

    const perfilPropio = await this.producerProfileService.findOwnSafe(usuarioId)

    if (perfilPropio?.id === conversacion.producerProfileId) return

    throw new ForbiddenException('No tienes permiso para escribir en esta conversacion.')
  }
}
