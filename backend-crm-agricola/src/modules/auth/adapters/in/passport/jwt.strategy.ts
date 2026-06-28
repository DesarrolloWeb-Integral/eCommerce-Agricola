import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

import type { UsuarioAutenticado } from '../../../domain/entities/usuario-autenticado'
import { AUTH_USER_REPOSITORY_PORT } from '../../../ports/out/auth-user.repository.port'
import type { AuthUserRepositoryPort } from '../../../ports/out/auth-user.repository.port'
import type { JwtPayload } from '../../../ports/out/token-service.port'

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken'

function extractAccessTokenFromCookie(request: Request): string | null {
  const cookies: unknown = request.cookies

  if (!cookies || typeof cookies !== 'object') {
    return null
  }

  const accessToken = (cookies as Record<string, unknown>)[ACCESS_TOKEN_COOKIE_NAME]

  return typeof accessToken === 'string' ? accessToken : null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,

    @Inject(AUTH_USER_REPOSITORY_PORT)
    private readonly authUserRepository: AuthUserRepositoryPort
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractAccessTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
    })
  }

  async validate(payload: JwtPayload): Promise<UsuarioAutenticado> {
    const usuario = await this.authUserRepository.findById(payload.sub)

    if (!usuario || !usuario.isActive) {
      throw new UnauthorizedException('El usuario autenticado no está disponible.')
    }

    return {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    }
  }
}
