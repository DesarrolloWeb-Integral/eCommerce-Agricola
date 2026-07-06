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

export interface ListarMensajesInput {
  conversacionId: string
  usuarioId: string
}

@Injectable()
export class ListarMensajesUseCase {
  constructor(
    @Inject(CONVERSACION_REPOSITORY_PORT)
    private readonly conversacionRepository: ConversacionRepositoryPort,
    @Inject(MENSAJE_REPOSITORY_PORT)
    private readonly mensajeRepository: MensajeRepositoryPort,
    private readonly producerProfileService: ProducerProfileService
  ) {}

  async execute(input: ListarMensajesInput): Promise<Mensaje[]> {
    const conversacion = await this.conversacionRepository.findById(input.conversacionId)

    if (!conversacion) {
      throw new NotFoundException('La conversacion solicitada no existe.')
    }

    const esCliente = conversacion.clienteId === input.usuarioId
    const perfilPropio = esCliente
      ? null
      : await this.producerProfileService.findOwnSafe(input.usuarioId)
    const esProductor = perfilPropio?.id === conversacion.producerProfileId

    if (!esCliente && !esProductor) {
      throw new ForbiddenException('No tienes permiso para ver esta conversacion.')
    }

    return this.mensajeRepository.findByConversacionId(conversacion.id)
  }
}
