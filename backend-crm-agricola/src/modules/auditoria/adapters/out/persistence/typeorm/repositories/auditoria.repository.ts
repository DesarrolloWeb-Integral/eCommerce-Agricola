import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuditoriaEntity } from '../entities/auditoria.entity'
import { AuditoriaRepositoryPort, LogRegistroInput } from '../../../auditoria.repository.port'

@Injectable()
export class AuditoriaRepositoryAdapter implements AuditoriaRepositoryPort {
  constructor(
    @InjectRepository(AuditoriaEntity)
    private readonly auditoriaRepo: Repository<AuditoriaEntity>
  ) {}

  async registrar(log: LogRegistroInput): Promise<void> {
    const nuevoLog = this.auditoriaRepo.create({
      usuarioId: log.usuarioId,
      accion: log.accion,
      recursoAfectado: log.recursoAfectado,
      detalle: log.detalle,
    })
    await this.auditoriaRepo.save(nuevoLog)
  }

  async obtenerTodos(): Promise<AuditoriaEntity[]> {
    return this.auditoriaRepo.find({
      order: { createdAt: 'DESC' },
    })
  }
}
