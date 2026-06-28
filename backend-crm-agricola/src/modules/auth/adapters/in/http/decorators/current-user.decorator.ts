import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { UsuarioAutenticado } from '../../../../domain/entities/usuario-autenticado'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UsuarioAutenticado => {
    const request = context.switchToHttp().getRequest<{
      user: UsuarioAutenticado
    }>()

    return request.user
  }
)
