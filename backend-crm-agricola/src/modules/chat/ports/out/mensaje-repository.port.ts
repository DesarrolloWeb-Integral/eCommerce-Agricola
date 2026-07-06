import { Mensaje } from '../../domain/entities/mensaje'

export const MENSAJE_REPOSITORY_PORT = 'MENSAJE_REPOSITORY_PORT'

export interface MensajeRepositoryPort {
  save(conversacionId: string, remitenteId: string, contenido: string): Promise<Mensaje>
  findByConversacionId(conversacionId: string): Promise<Mensaje[]>
}
