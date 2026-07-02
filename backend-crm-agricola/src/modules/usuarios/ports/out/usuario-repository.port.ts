import { Usuario } from '../../domain/entities/usuario'
import type { EstadoCuenta } from '../../domain/value-objects/estado-cuenta.enum'

export const USUARIO_REPOSITORY_PORT = Symbol('USUARIO_REPOSITORY_PORT')

export interface UsuarioRepositoryPort {
  save(usuario: Usuario): Promise<Usuario>
  findByEmail(email: string): Promise<Usuario | null>
  findByPhone(phone: string): Promise<Usuario | null>
  findByEmailIncludingDeleted(email: string): Promise<Usuario | null>
  findByPhoneIncludingDeleted(phone: string): Promise<Usuario | null>
  findById(id: string): Promise<Usuario | null>
  findByEstadoCuenta(estadoCuenta: EstadoCuenta): Promise<Usuario[]>
}
