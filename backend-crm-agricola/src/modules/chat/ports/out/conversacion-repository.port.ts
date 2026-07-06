import { Conversacion } from '../../domain/entities/conversacion'

export const CONVERSACION_REPOSITORY_PORT = 'CONVERSACION_REPOSITORY_PORT'

export interface CrearConversacionInput {
  clienteId: string
  producerProfileId: string
  productoId: string | null
  pedidoId: string | null
}

export interface ConversacionRepositoryPort {
  save(input: CrearConversacionInput): Promise<Conversacion>
  findById(id: string): Promise<Conversacion | null>
  findExistente(
    clienteId: string,
    producerProfileId: string,
    productoId: string | null,
    pedidoId: string | null
  ): Promise<Conversacion | null>
  findByClienteId(clienteId: string): Promise<Conversacion[]>
  findByProducerProfileId(producerProfileId: string): Promise<Conversacion[]>
}
