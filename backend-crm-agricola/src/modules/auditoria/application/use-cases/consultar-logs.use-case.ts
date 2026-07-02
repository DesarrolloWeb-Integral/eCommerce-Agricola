import { Inject, Injectable } from '@nestjs/common'
import { AUDITORIA_REPOSITORY_PORT } from '../../adapters/out/auditoria.repository.port'
import type { AuditoriaRepositoryPort } from '../../adapters/out/auditoria.repository.port'
import { AuditoriaEntity } from '../../adapters/out/persistence/typeorm/entities/auditoria.entity'

@Injectable()
export class ConsultarLogsUseCase {
  constructor(
    @Inject(AUDITORIA_REPOSITORY_PORT)
    private readonly auditoriaRepository: AuditoriaRepositoryPort
  ) {}

  async execute(): Promise<AuditoriaEntity[]> {
    // Retorna todos los registros de auditoría ordenados por fecha de creación desc
    return await this.auditoriaRepository.obtenerTodos()
  }
}
