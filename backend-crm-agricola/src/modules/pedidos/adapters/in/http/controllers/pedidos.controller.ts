import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { CrearPedidoUseCase } from '../../../../application/use-cases/crear-pedido.use-case'
import { ListarMisPedidosUseCase } from 'src/modules/pedidos/application/use-cases/listar-mis-pedidos.use-case'
import { ListarPedidosDeMisProductosUseCase } from 'src/modules/pedidos/application/use-cases/listar-pedidos-de-mis-productos.use-case'
import { CancelarPedidoUseCase } from 'src/modules/pedidos/application/use-cases/cancelar-pedido.use-case'
import type { Pedido } from '../../../../domain/entities/pedido'
import { CrearPedidoDto } from '../dto/crear-pedido.dto'
import { PedidoIdParamDto } from '../dto/pedido-id-param.dto'

interface PedidoResponse {
  id: string
  producerProfileId: string
  clientLabel?: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    subtotal: number
  }[]
  subtotal: number
  estado: string
  createdAt: Date
  updatedAt: Date
}

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly crearPedidoUseCase: CrearPedidoUseCase,
    private readonly listarMisPedidosUseCase: ListarMisPedidosUseCase,
    private readonly listarPedidosDeMisProductosUseCase: ListarPedidosDeMisProductosUseCase,
    private readonly producerProfileService: ProducerProfileService,
    private readonly cancelarPedidoUseCase: CancelarPedidoUseCase,

    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  @Get('mis-productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  async listarPedidosDeMisProductos(
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<PedidoResponse[]> {
    const perfilProductor = await this.producerProfileService.findOwn(usuarioAutenticado.id)
    const pedidos = await this.listarPedidosDeMisProductosUseCase.execute(perfilProductor.id)

    return Promise.all(
      pedidos.map((pedido) =>
        this.toResponse(pedido, {
          includeClientLabel: true,
        })
      )
    )
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async crear(
    @Body() dto: CrearPedidoDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<PedidoResponse> {
    const pedido = await this.crearPedidoUseCase.execute({
      clientId: usuarioAutenticado.id,
      items: dto.items,
    })

    return this.toResponse(pedido)
  }

  @Get('mis-pedidos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async listarMisPedidos(
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<PedidoResponse[]> {
    const pedidos = await this.listarMisPedidosUseCase.execute(usuarioAutenticado.id)

    return Promise.all(pedidos.map((pedido) => this.toResponse(pedido)))
  }

  @Patch(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async cancelar(
    @Param() params: PedidoIdParamDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<PedidoResponse> {
    const pedido = await this.cancelarPedidoUseCase.execute({
      pedidoId: params.id,
      clientId: usuarioAutenticado.id,
      usuarioId: usuarioAutenticado.id,
    })

    return this.toResponse(pedido)
  }

  private async toResponse(
    pedido: Pedido,
    options: { includeClientLabel?: boolean } = {}
  ): Promise<PedidoResponse> {
    const response: PedidoResponse = {
      id: pedido.id,
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

    if (options.includeClientLabel) {
      response.clientLabel = await this.getClientLabel(pedido.clientId)
    }

    return response
  }

  private async getClientLabel(clientId: string): Promise<string> {
    const usuario = await this.usuarioRepository.findById(clientId)

    return usuario?.isCancelled() ? 'Cliente no disponible' : 'Cliente registrado'
  }
}
