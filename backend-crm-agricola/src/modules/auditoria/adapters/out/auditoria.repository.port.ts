export const AUDITORIA_REPOSITORY_PORT = Symbol('AUDITORIA_REPOSITORY_PORT')
import type { AuditoriaEntity } from '../out/persistence/typeorm/entities/auditoria.entity'

export interface LogRegistroInput {
  usuarioId: string
  accion: string
  recursoAfectado: string
  detalle?: string
}

export interface AuditoriaRepositoryPort {
  registrar(log: LogRegistroInput): Promise<void>
  obtenerTodos(): Promise<AuditoriaEntity[]>
}
