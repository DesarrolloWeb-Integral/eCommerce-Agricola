import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { ProducerProfileService } from './producer-profile.service'
import { CreateProducerProfileDto, UpdateProducerProfileDto } from './dto/producer-profile.dto'

// 1. Definimos la estructura que esperas en el payload de tu JWT
interface JwtPayload {
  id?: string
  sub?: string
  // Añade aquí otras propiedades si las necesitas (ej. email, roles, etc.)
}

// 2. Extendemos el Request de Express de forma segura
interface AuthenticatedRequest extends ExpressRequest {
  user?: JwtPayload
}

@Controller('producer-profiles')
export class ProducerProfileController {
  constructor(private readonly service: ProducerProfileService) {}

  /** Crear perfil — requiere rol PRODUCER */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateProducerProfileDto) {
    // Al usar el operador operacional de encadenamiento (?.), TypeScript sabe que podría ser undefined,
    // pero al usar '??' garantizamos que si no viene, mande una cadena vacía o maneja el error según tu lógica.
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.create(userId, dto)
  }

  /** Actualizar perfil — solo el productor propietario */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProducerProfileDto
  ) {
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.update(id, userId, dto)
  }

  /** Ver perfil propio (datos privados incluidos) */
  @Get('me')
  findOwn(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.findOwn(userId)
  }

  /** Vista pública por ID de perfil — accesible para clientes y visitantes */
  @Get(':id/public')
  findPublicById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPublicById(id)
  }

  /** Vista pública por userId del productor */
  @Get('user/:userId/public')
  findPublicByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findPublicByUserId(userId)
  }
}
