import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { ProducerProfileService } from './producer-profile.service'
import { CreateProducerProfileDto, UpdateProducerProfileDto } from './dto/producer-profile.dto'

interface JwtPayload {
  id?: string
  sub?: string
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: JwtPayload
}

/**
 * Rutas:
 *   POST   /producer-profiles                    → crear perfil
 *   PATCH  /producer-profiles/:id                → actualizar perfil
 *   GET    /producer-profiles/me                 → perfil propio (privado)
 *   GET    /producer-profiles/search?q=nombre    → buscar por nombre (público)
 *   GET    /producer-profiles/recommended        → listado recomendados (público)
 *   GET    /producer-profiles/:id/public         → perfil público por id
 *   GET    /producer-profiles/user/:userId/public → perfil público por userId
 */
@Controller('producer-profiles')
export class ProducerProfileController {
  constructor(private readonly service: ProducerProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateProducerProfileDto) {
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.create(userId, dto)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProducerProfileDto
  ) {
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.update(id, userId, dto)
  }

  @Get('me')
  findOwn(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id ?? req.user?.sub ?? ''
    return this.service.findOwn(userId)
  }

  /** Buscar productores por nombre — público, sin auth */
  @Get('search')
  search(@Query('q') q: string) {
    return this.service.searchByName(q ?? '')
  }

  /** Productores recomendados — público, sin auth */
  @Get('recommended')
  recommended(@Query('limit') limit?: string) {
    return this.service.findRecommended(limit ? Number(limit) : 6)
  }

  /** Vista pública por ID de perfil */
  @Get(':id/public')
  findPublicById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPublicById(id)
  }

  /** Vista pública por userId */
  @Get('user/:userId/public')
  findPublicByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findPublicByUserId(userId)
  }
}
