import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import type { CookieOptions, Request, Response } from 'express'

import { IniciarSesionUseCase } from '../../../../application/use-cases/iniciar-sesion.use-case'
import type { IniciarSesionInput } from '../../../../application/use-cases/iniciar-sesion.use-case'
import { IniciarSesionDto } from '../dto/iniciar-sesion.dto'
import {
  RefrescarTokenInput,
  RefrescarTokenUseCase,
} from 'src/modules/auth/application/use-cases/refrescar-token.use-case'
import {
  CerrarSesionInput,
  CerrarSesionUseCase,
} from 'src/modules/auth/application/use-cases/cerrar-sesion.use-case'
import { CurrentUser } from '../decorators/current-user.decorator'
import { JwtAuthGuard } from '../../passport/jwt-auth.guard'
import type { UsuarioAutenticado } from '../../../../domain/entities/usuario-autenticado'
import type { AuthTokens } from '../../../../ports/out/token-service.port'

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken'
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

function getCookieValue(request: Request, cookieName: string): string | null {
  const cookies: unknown = request.cookies

  if (!cookies || typeof cookies !== 'object') {
    return null
  }

  const cookieValue = (cookies as Record<string, unknown>)[cookieName]

  return typeof cookieValue === 'string' ? cookieValue : null
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly iniciarSesionUseCase: IniciarSesionUseCase,
    private readonly refrescarTokenUseCase: RefrescarTokenUseCase,
    private readonly cerrarSesionUseCase: CerrarSesionUseCase
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async iniciarSesion(
    @Body() iniciarSesionDto: IniciarSesionDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const input: IniciarSesionInput = {
      email: iniciarSesionDto.email,
      password: iniciarSesionDto.password,
    }

    const tokens = await this.iniciarSesionUseCase.execute(input)

    this.setAuthCookies(response, tokens)

    return {
      message: 'Sesion iniciada correctamente.',
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refrescarToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const refreshToken = getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME)

    if (!refreshToken) {
      this.clearAuthCookies(response)
      throw new UnauthorizedException('No existe una sesion activa.')
    }

    const input: RefrescarTokenInput = {
      refreshToken,
    }

    try {
      const tokens = await this.refrescarTokenUseCase.execute(input)

      this.setAuthCookies(response, tokens)

      return {
        message: 'Sesion renovada correctamente.',
      }
    } catch (error) {
      this.clearAuthCookies(response)
      throw error
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async cerrarSesion(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const refreshToken = getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME)

    try {
      if (refreshToken) {
        const input: CerrarSesionInput = {
          refreshToken,
        }

        await this.cerrarSesionUseCase.execute(input)
      }
    } finally {
      this.clearAuthCookies(response)
    }

    return {
      message: 'Sesión cerrada correctamente.',
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  obtenerUsuarioAutenticado(@CurrentUser() usuario: UsuarioAutenticado): UsuarioAutenticado {
    return usuario
  }

  private setAuthCookies(response: Response, tokens: AuthTokens): void {
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
      ...this.getBaseCookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      ...this.getBaseCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE,
    })
  }

  private clearAuthCookies(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, this.getBaseCookieOptions())
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, this.getBaseCookieOptions())
  }

  private getBaseCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    }
  }
}
