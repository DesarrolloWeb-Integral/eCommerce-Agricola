import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ProducerProfileService } from './producer-profile.service'
import { CreateProducerProfileDto, UpdateProducerProfileDto } from './dto/producer-profile.dto'
import { JwtAuthGuard } from '../modules/auth/adapters/in/passport/jwt-auth.guard'
import { RolesGuard } from '../modules/auth/adapters/in/passport/roles.guard'
import { CurrentUser } from '../modules/auth/adapters/in/http/decorators/current-user.decorator'
import { Roles } from '../modules/auth/adapters/in/http/decorators/roles.decorator'
import type { UsuarioAutenticado } from '../modules/auth/domain/entities/usuario-autenticado'
import { RolUsuario } from '../modules/usuarios/domain/value-objects/rol-usuario.enum'

@Controller('producer-profiles')
export class ProducerProfileController {
  constructor(private readonly service: ProducerProfileService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: UsuarioAutenticado, @Body() dto: CreateProducerProfileDto) {
    return this.service.create(user.id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UsuarioAutenticado,
    @Body() dto: UpdateProducerProfileDto
  ) {
    return this.service.update(id, user.id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  @Get('me')
  findOwn(@CurrentUser() user: UsuarioAutenticado) {
    return this.service.findOwn(user.id)
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.service.searchByName(q ?? '')
  }

  @Get('recommended')
  recommended(@Query('limit') limit?: string) {
    return this.service.findRecommended(limit ? Number(limit) : 6)
  }

  @Get(':id/public')
  findPublicById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPublicById(id)
  }

  @Get('user/:userId/public')
  findPublicByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findPublicByUserId(userId)
  }
}
