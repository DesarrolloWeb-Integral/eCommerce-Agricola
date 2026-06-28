import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from '../http/decorators/roles.decorator'
import type { UsuarioAutenticado } from '../../../domain/entities/usuario-autenticado'
import type { RolUsuario } from '../../../../usuarios/domain/value-objects/rol-usuario.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<{
      user?: UsuarioAutenticado
    }>()

    const usuario = request.user

    if (!usuario) {
      return false
    }

    return requiredRoles.includes(usuario.role)
  }
}
