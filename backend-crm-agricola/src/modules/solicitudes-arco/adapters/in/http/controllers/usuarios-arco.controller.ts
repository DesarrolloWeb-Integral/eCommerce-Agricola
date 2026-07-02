import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'

import { clearAuthCookies } from 'src/modules/auth/adapters/in/http/cookies/auth-cookies.util'
import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { ExportarDatosUsuarioUseCase } from '../../../../application/use-cases/exportar-datos-usuario.use-case'
import type { ExportacionDatosUsuario } from '../../../../application/use-cases/exportar-datos-usuario.use-case'
import { MantenerCuentaUseCase } from '../../../../application/use-cases/mantener-cuenta.use-case'
import { SolicitarCancelacionCuentaUseCase } from '../../../../application/use-cases/solicitar-cancelacion-cuenta.use-case'
import { CancelacionCuentaDto } from '../dto/cancelacion-cuenta.dto'
import { UsuarioResponseDto } from 'src/modules/usuarios/adapters/in/http/dto/usuario-responde.dto'

interface CancelacionCuentaResponse {
  message: string
}

@Controller('usuarios')
export class UsuariosArcoController {
  constructor(
    private readonly exportarDatosUsuarioUseCase: ExportarDatosUsuarioUseCase,
    private readonly solicitarCancelacionCuentaUseCase: SolicitarCancelacionCuentaUseCase,
    private readonly mantenerCuentaUseCase: MantenerCuentaUseCase
  ) {}

  @Get('me/exportacion')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/json')
  async exportarMisDatos(
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<ExportacionDatosUsuario> {
    return this.exportarDatosUsuarioUseCase.execute(usuario.id)
  }

  @Post('me/cancelacion')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async solicitarCancelacion(
    @Body() dto: CancelacionCuentaDto,
    @CurrentUser() usuario: UsuarioAutenticado,
    @Res({ passthrough: true }) response: Response
  ): Promise<CancelacionCuentaResponse> {
    const result = await this.solicitarCancelacionCuentaUseCase.execute({
      userId: usuario.id,
      currentPassword: dto.currentPassword,
      confirmCancellation: dto.confirmCancellation,
    })

    if (result.accountCancelled) {
      clearAuthCookies(response)
    }

    return {
      message: result.message,
    }
  }

  @Post('me/mantener-cuenta')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async mantenerCuenta(@CurrentUser() usuario: UsuarioAutenticado): Promise<UsuarioResponseDto> {
    const cuenta = await this.mantenerCuentaUseCase.execute(usuario.id)

    return UsuarioResponseDto.fromDomain(cuenta)
  }
}
