import type { RolUsuario } from '../../../usuarios/domain/value-objects/rol-usuario.enum'

export interface UsuarioAutenticado {
  id: string
  email: string
  role: RolUsuario
}
