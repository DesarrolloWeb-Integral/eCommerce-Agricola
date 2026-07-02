import {
  BadRequestException,
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
import type { Request, Response } from 'express'

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
import {
  clearAuthCookies,
  getRefreshTokenFromCookie,
  setAuthCookies,
} from '../cookies/auth-cookies.util'

function assertEmptyBody(body: unknown): void {
  if (body === undefined || body === null) return

  const hasInvalidBody =
    typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length > 0

  if (hasInvalidBody) {
    throw new BadRequestException('No se permiten campos adicionales.')
  }
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

    setAuthCookies(response, tokens)

    return {
      message: 'Sesion iniciada correctamente.',
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refrescarToken(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    assertEmptyBody(body)

    const refreshToken = getRefreshTokenFromCookie(request)

    if (!refreshToken) {
      clearAuthCookies(response)
      throw new UnauthorizedException('No existe una sesion activa.')
    }

    const input: RefrescarTokenInput = {
      refreshToken,
    }

    try {
      const tokens = await this.refrescarTokenUseCase.execute(input)

      setAuthCookies(response, tokens)

      return {
        message: 'Sesion renovada correctamente.',
      }
    } catch (error) {
      clearAuthCookies(response)
      throw error
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async cerrarSesion(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    assertEmptyBody(body)

    const refreshToken = getRefreshTokenFromCookie(request)

    try {
      if (refreshToken) {
        const input: CerrarSesionInput = {
          refreshToken,
        }

        await this.cerrarSesionUseCase.execute(input)
      }
    } finally {
      clearAuthCookies(response)
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
}
