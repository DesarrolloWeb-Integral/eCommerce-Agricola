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
} from '@nestjs/common'

import { EditarUsuarioDto } from '../dto/editar-usuario.dto'
import { RegistrarUsuarioDto } from '../dto/registrar-usuario.dto'
import { BuscarUsuarioPorEmailUseCase } from '../../../../application/use-cases/buscar-usuario-por-email.use-case'
import { BuscarUsuarioPorIdUseCase } from '../../../../application/use-cases/buscar-usuario-por-id.use-case'
import { BuscarUsuarioPorTelefonoUseCase } from '../../../../application/use-cases/buscar-usuario-por-telefono.use-case'
import { DesactivarUsuarioUseCase } from '../../../../application/use-cases/desactivar-usuario.use-case'
import { EditarUsuarioUseCase } from '../../../../application/use-cases/editar-usuario.use-case'
import type { EditarUsuarioInput } from '../../../../application/use-cases/editar-usuario.use-case'
import { RegistrarUsuarioUseCase } from '../../../../application/use-cases/registrar-usuario.use-case'
import type { RegistrarUsuarioInput } from '../../../../application/use-cases/registrar-usuario.use-case'

interface UsuarioResponse {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

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
    private readonly desactivarUsuarioUseCase: DesactivarUsuarioUseCase
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
    }

    const usuario = await this.registrarUsuarioUseCase.execute(input)

    return {
      id: usuario.id,
      message: 'Usuario registrado correctamente.',
    }
  }

  @Get('buscar/email/:email')
  async buscarPorEmail(@Param('email') email: string): Promise<UsuarioResponse> {
    const usuario = await this.buscarUsuarioPorEmailUseCase.execute(email)

    return this.toResponse(usuario)
  }

  @Get('buscar/telefono/:phone')
  async buscarPorTelefono(@Param('phone') phone: string): Promise<UsuarioResponse> {
    const usuario = await this.buscarUsuarioPorTelefonoUseCase.execute(phone)

    return this.toResponse(usuario)
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<UsuarioResponse> {
    const usuario = await this.buscarUsuarioPorIdUseCase.execute(id)

    return this.toResponse(usuario)
  }

  @Patch(':id')
  async editar(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() editarUsuarioDto: EditarUsuarioDto
  ): Promise<UsuarioResponse> {
    const input: EditarUsuarioInput = {
      id,
      name: editarUsuarioDto.name,
      lastName: editarUsuarioDto.lastName,
      email: editarUsuarioDto.email,
      phone: editarUsuarioDto.phone,
    }

    const usuario = await this.editarUsuarioUseCase.execute(input)

    return this.toResponse(usuario)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async desactivar(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<MensajeResponse> {
    await this.desactivarUsuarioUseCase.execute(id)

    return {
      message: 'Usuario desactivado correctamente.',
    }
  }

  private toResponse(usuario: {
    id: string
    name: string
    lastName: string
    email: string
    phone: string
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }): UsuarioResponse {
    return {
      id: usuario.id,
      name: usuario.name,
      lastName: usuario.lastName,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
      isActive: usuario.isActive,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    }
  }
}
