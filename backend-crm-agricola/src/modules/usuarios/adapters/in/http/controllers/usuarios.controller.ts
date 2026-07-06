import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common'

import { EditarUsuarioDto } from '../dto/editar-usuario.dto'
import { ActualizarConsentimientosDto } from '../dto/actualizar-consentimientos.dto'
import { RegistrarUsuarioDto } from '../dto/registrar-usuario.dto'
import { UsuarioResponseDto } from '../dto/usuario-responde.dto'
import { ActualizarConsentimientosUseCase } from '../../../../application/use-cases/actualizar-consentimientos.use-case'
import { BuscarUsuarioPorEmailUseCase } from '../../../../application/use-cases/buscar-usuario-por-email.use-case'
import { BuscarUsuarioPorIdUseCase } from '../../../../application/use-cases/buscar-usuario-por-id.use-case'
import { BuscarUsuarioPorTelefonoUseCase } from '../../../../application/use-cases/buscar-usuario-por-telefono.use-case'
import { DesactivarUsuarioUseCase } from '../../../../application/use-cases/desactivar-usuario.use-case'
import { EditarUsuarioUseCase } from '../../../../application/use-cases/editar-usuario.use-case'
import type { EditarUsuarioInput } from '../../../../application/use-cases/editar-usuario.use-case'
import { RegistrarUsuarioUseCase } from '../../../../application/use-cases/registrar-usuario.use-case'
import type { RegistrarUsuarioInput } from '../../../../application/use-cases/registrar-usuario.use-case'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { RolesGuard } from 'src/modules/auth/adapters/in/passport/roles.guard'
import { Roles } from 'src/modules/auth/adapters/in/http/decorators/roles.decorator'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'

interface RegistroUsuarioResponse {
  id: string
  message: string
}

interface MensajeResponse {
  message: string
}

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly registrarUsuarioUseCase: RegistrarUsuarioUseCase,
    private readonly buscarUsuarioPorIdUseCase: BuscarUsuarioPorIdUseCase,
    private readonly buscarUsuarioPorEmailUseCase: BuscarUsuarioPorEmailUseCase,
    private readonly buscarUsuarioPorTelefonoUseCase: BuscarUsuarioPorTelefonoUseCase,
    private readonly editarUsuarioUseCase: EditarUsuarioUseCase,
    private readonly desactivarUsuarioUseCase: DesactivarUsuarioUseCase,
    private readonly actualizarConsentimientosUseCase: ActualizarConsentimientosUseCase
  ) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async registrar(
    @Body() registrarUsuarioDto: RegistrarUsuarioDto
  ): Promise<RegistroUsuarioResponse> {
    const input: RegistrarUsuarioInput = {
      name: registrarUsuarioDto.name,
      lastName: registrarUsuarioDto.lastName,
      email: registrarUsuarioDto.email,
      phone: registrarUsuarioDto.phone,
      password: registrarUsuarioDto.password,
      role: registrarUsuarioDto.role,
      privacyNoticeAccepted: registrarUsuarioDto.privacyNoticeAccepted,
    }

    const usuario = await this.registrarUsuarioUseCase.execute(input)

    return {
      id: usuario.id,
      message: 'Usuario registrado correctamente.',
    }
  }

  @Get('buscar/email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async buscarPorEmail(@Param('email') email: string): Promise<UsuarioResponseDto> {
    const usuario = await this.buscarUsuarioPorEmailUseCase.execute(email)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Get('buscar/telefono/:phone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async buscarPorTelefono(@Param('phone') phone: string): Promise<UsuarioResponseDto> {
    const usuario = await this.buscarUsuarioPorTelefonoUseCase.execute(phone)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async obtenerMiCuenta(
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.buscarUsuarioPorIdUseCase.execute(usuarioAutenticado.id)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async editarMiCuenta(
    @Body() editarUsuarioDto: EditarUsuarioDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<UsuarioResponseDto> {
    const input: EditarUsuarioInput = {
      id: usuarioAutenticado.id,
      name: editarUsuarioDto.name,
      lastName: editarUsuarioDto.lastName,
      email: editarUsuarioDto.email,
      phone: editarUsuarioDto.phone,
    }

    const usuario = await this.editarUsuarioUseCase.execute(input)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Post('me/consentimientos')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async actualizarMisConsentimientos(
    @Body() dto: ActualizarConsentimientosDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.actualizarConsentimientosUseCase.execute({
      userId: usuarioAutenticado.id,
      privacyNoticeAccepted: dto.privacyNoticeAccepted,
    })

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async buscarPorId(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.buscarUsuarioPorIdUseCase.execute(id)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE, RolUsuario.PROVEEDOR, RolUsuario.ADMINISTRADOR)
  async editar(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() editarUsuarioDto: EditarUsuarioDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<UsuarioResponseDto> {
    if (usuarioAutenticado.id !== id && usuarioAutenticado.role !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permiso para editar el perfil de otro usuario.')
    }

    const input: EditarUsuarioInput = {
      id,
      name: editarUsuarioDto.name,
      lastName: editarUsuarioDto.lastName,
      email: editarUsuarioDto.email,
      phone: editarUsuarioDto.phone,
    }

    const usuario = await this.editarUsuarioUseCase.execute(input)

    return UsuarioResponseDto.fromDomain(usuario)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE, RolUsuario.PROVEEDOR, RolUsuario.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  async desactivar(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<MensajeResponse> {
    if (usuarioAutenticado.id !== id && usuarioAutenticado.role !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permiso para desactivar la cuenta de otro usuario.')
    }

    await this.desactivarUsuarioUseCase.execute(id)

    return {
      message: 'Usuario desactivado correctamente.',
    }
  }
}
