import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import { Roles } from 'src/modules/auth/adapters/in/http/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import { RolesGuard } from 'src/modules/auth/adapters/in/passport/roles.guard'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import { CrearOposicionTransferenciasUseCase } from '../../../../application/use-cases/crear-oposicion-transferencias.use-case'
import { ListarMisSolicitudesArcoUseCase } from '../../../../application/use-cases/listar-mis-solicitudes-arco.use-case'
import { ListarSolicitudesArcoUseCase } from '../../../../application/use-cases/listar-solicitudes-arco.use-case'
import { ResolverSolicitudArcoUseCase } from '../../../../application/use-cases/resolver-solicitud-arco.use-case'
import type { SolicitudArco } from '../../../../domain/entities/solicitud-arco'
import { OposicionTransferenciasDto } from '../dto/oposicion-transferencias.dto'
import { ResolverSolicitudArcoDto } from '../dto/resolver-solicitud-arco.dto'

interface SolicitudArcoResponse {
  id: string
  userId: string
  type: string
  status: string
  reason: string | null
  requestedDataDescription: string | null
  response: string | null
  requestedAt: Date
  resolvedAt: Date | null
  resolvedByUserId: string | null
  createdAt: Date
  updatedAt: Date
}

@Controller('solicitudes-arco')
export class SolicitudesArcoController {
  constructor(
    private readonly listarMisSolicitudesUseCase: ListarMisSolicitudesArcoUseCase,
    private readonly crearOposicionUseCase: CrearOposicionTransferenciasUseCase,
    private readonly listarSolicitudesUseCase: ListarSolicitudesArcoUseCase,
    private readonly resolverSolicitudUseCase: ResolverSolicitudArcoUseCase
  ) {}

  @Get('mis-solicitudes')
  @UseGuards(JwtAuthGuard)
  async listarMisSolicitudes(
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<SolicitudArcoResponse[]> {
    const solicitudes = await this.listarMisSolicitudesUseCase.execute(usuario.id)

    return solicitudes.map((solicitud) => this.toResponse(solicitud))
  }

  @Post('oposicion-transferencias')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async crearOposicion(
    @Body() dto: OposicionTransferenciasDto,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<SolicitudArcoResponse> {
    const solicitud = await this.crearOposicionUseCase.execute({
      userId: usuario.id,
      reason: dto.reason,
    })

    return this.toResponse(solicitud)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async listarSolicitudes(): Promise<SolicitudArcoResponse[]> {
    const solicitudes = await this.listarSolicitudesUseCase.execute()

    return solicitudes.map((solicitud) => this.toResponse(solicitud))
  }

  @Patch(':id/resolver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async resolverSolicitud(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ResolverSolicitudArcoDto,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<SolicitudArcoResponse> {
    const solicitud = await this.resolverSolicitudUseCase.execute({
      solicitudId: id,
      status: dto.status,
      response: dto.response,
      resolvedByUserId: usuario.id,
    })

    return this.toResponse(solicitud)
  }

  private toResponse(solicitud: SolicitudArco): SolicitudArcoResponse {
    return {
      id: solicitud.id,
      userId: solicitud.userId,
      type: solicitud.type,
      status: solicitud.status,
      reason: solicitud.reason,
      requestedDataDescription: solicitud.requestedDataDescription,
      response: solicitud.response,
      requestedAt: solicitud.requestedAt,
      resolvedAt: solicitud.resolvedAt,
      resolvedByUserId: solicitud.resolvedByUserId,
      createdAt: solicitud.createdAt,
      updatedAt: solicitud.updatedAt,
    }
  }
}
