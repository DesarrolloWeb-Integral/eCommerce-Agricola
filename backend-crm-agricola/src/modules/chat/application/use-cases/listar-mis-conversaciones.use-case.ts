import { Inject, Injectable } from '@nestjs/common'
import { Conversacion } from '../../domain/entities/conversacion'
import {
  CONVERSACION_REPOSITORY_PORT,
  type ConversacionRepositoryPort,
} from '../../ports/out/conversacion-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'

export interface ListarMisConversacionesInput {
  usuarioId: string
  rol: RolUsuario
}

@Injectable()
export class ListarMisConversacionesUseCase {
  constructor(
    @Inject(CONVERSACION_REPOSITORY_PORT)
    private readonly conversacionRepository: ConversacionRepositoryPort,
    private readonly producerProfileService: ProducerProfileService
  ) {}

  async execute(input: ListarMisConversacionesInput): Promise<Conversacion[]> {
    if (input.rol === RolUsuario.PROVEEDOR) {
      const perfil = await this.producerProfileService.findOwn(input.usuarioId)
      return this.conversacionRepository.findByProducerProfileId(perfil.id)
    }

    return this.conversacionRepository.findByClienteId(input.usuarioId)
  }
}
