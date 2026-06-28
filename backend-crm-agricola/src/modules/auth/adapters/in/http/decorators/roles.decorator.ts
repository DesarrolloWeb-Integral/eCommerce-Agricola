import { SetMetadata } from '@nestjs/common'

import type { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'

export const ROLES_KEY = 'roles'

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles)
