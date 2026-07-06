import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Conversacion } from '../../domain/entities/conversacion'
import {
  CONVERSACION_REPOSITORY_PORT,
  type ConversacionRepositoryPort,
} from '../../ports/out/conversacion-repository.port'
import {
  MENSAJE_REPOSITORY_PORT,
  type MensajeRepositoryPort,
} from '../../ports/out/mensaje-repository.port'

export interface IniciarConversacionInput {
  clienteId: string
  producerProfileId: string
  productoId: string | null
  pedidoId: string | null
  mensajeInicial: string
}

@Injectable()
export class IniciarConversacionUseCase {
  constructor(
    @Inject(CONVERSACION_REPOSITORY_PORT)
    private readonly conversacionRepository: ConversacionRepositoryPort,
    @Inject(MENSAJE_REPOSITORY_PORT)
    private readonly mensajeRepository: MensajeRepositoryPort
  ) {}

  async execute(input: IniciarConversacionInput): Promise<Conversacion> {
    if (!input.productoId && !input.pedidoId) {
      throw new BadRequestException(
        'La conversacion debe estar relacionada con un producto o un pedido.'
      )
    }

    const existente = await this.conversacionRepository.findExistente(
      input.clienteId,
      input.producerProfileId,
      input.productoId,
      input.pedidoId
    )

    const conversacion =
      existente ??
      (await this.conversacionRepository.save({
        clienteId: input.clienteId,
        producerProfileId: input.producerProfileId,
        productoId: input.productoId,
        pedidoId: input.pedidoId,
      }))

    await this.mensajeRepository.save(conversacion.id, input.clienteId, input.mensajeInicial)

    return conversacion
  }
}
