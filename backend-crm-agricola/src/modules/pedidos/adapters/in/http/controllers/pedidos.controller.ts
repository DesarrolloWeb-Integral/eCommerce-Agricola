import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CrearPedidoUseCase } from '../../../../application/use-cases/crear-pedido.use-case'
import { CrearPedidoDto } from '../dto/crear-pedido.dto'
import { ListarMisPedidosUseCase } from 'src/modules/pedidos/application/use-cases/listar-mis-pedidos.use-case'
import { ListarPedidosDeMisProductosUseCase } from 'src/modules/pedidos/application/use-cases/listar-pedidos-de-mis-productos.use-case'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { CancelarPedidoUseCase } from 'src/modules/pedidos/application/use-cases/cancelar-pedido.use-case'
import { PedidoIdParamDto } from '../dto/pedido-id-param.dto'
import { ConfirmarPedidoUseCase } from 'src/modules/pedidos/application/use-cases/confirmar-pedido.use-case'
import type { Pedido } from '../../../../domain/entities/pedido'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly crearPedidoUseCase: CrearPedidoUseCase,
    private readonly listarMisPedidosUseCase: ListarMisPedidosUseCase,
    private readonly listarPedidosDeMisProductosUseCase: ListarPedidosDeMisProductosUseCase,
    private readonly producerProfileService: ProducerProfileService,
    private readonly cancelarPedidoUseCase: CancelarPedidoUseCase,
    private readonly confirmarPedidoUseCase: ConfirmarPedidoUseCase
  ) {}

  @Get('mis-productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  async listarPedidosDeMisProductos(@CurrentUser() usuarioAutenticado: UsuarioAutenticado) {
    const perfilProductor = await this.producerProfileService.findOwn(usuarioAutenticado.id)

    const pedidos = await this.listarPedidosDeMisProductosUseCase.execute(perfilProductor.id)

    return pedidos.map((pedido) => this.toResponse(pedido))
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async crear(@Body() dto: CrearPedidoDto, @CurrentUser() usuarioAutenticado: UsuarioAutenticado) {
    const pedido = await this.crearPedidoUseCase.execute({
      clientId: usuarioAutenticado.id,
      items: dto.items,
    })

    return this.toResponse(pedido)
  }

  @Get('mis-pedidos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async listarMisPedidos(@CurrentUser() usuarioAutenticado: UsuarioAutenticado) {
    const pedidos = await this.listarMisPedidosUseCase.execute(usuarioAutenticado.id)

    return pedidos.map((pedido) => this.toResponse(pedido))
  }

  @Patch(':id/confirmar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  async confirmar(
    @Param() params: PedidoIdParamDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ) {
    const perfilProductor = await this.producerProfileService.findOwn(usuarioAutenticado.id)

    const pedido = await this.confirmarPedidoUseCase.execute({
      pedidoId: params.id,
      producerProfileId: perfilProductor.id,
    })

    return this.toResponse(pedido)
  }

  @Patch(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async cancelar(
    @Param() params: PedidoIdParamDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ) {
    const pedido = await this.cancelarPedidoUseCase.execute({
      pedidoId: params.id,
      clientId: usuarioAutenticado.id,
    })

    return this.toResponse(pedido)
  }

  private toResponse(pedido: Pedido) {
    return {
      id: pedido.id,
      clientId: pedido.clientId,
      producerProfileId: pedido.producerProfileId,
      items: pedido.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      subtotal: pedido.subtotal,
      estado: pedido.estado,
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt,
    }
  }
}
