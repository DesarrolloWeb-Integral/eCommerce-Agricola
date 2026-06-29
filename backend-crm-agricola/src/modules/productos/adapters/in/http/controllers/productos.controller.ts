import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import { RolesGuard } from 'src/modules/auth/adapters/in/passport/roles.guard'
import { Roles } from 'src/modules/auth/adapters/in/http/decorators/roles.decorator'
import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { RegistrarProductoUseCase } from '../../../../application/use-cases/registrar-producto.use-case'
import { EditarProductoUseCase } from '../../../../application/use-cases/editar-producto.use-case'
import { EliminarProductoUseCase } from '../../../../application/use-cases/eliminar-producto.use-case'
import { ListarProductosUseCase } from '../../../../application/use-cases/listar-productos.use-case'
import { RegistrarProductoDto } from '../dto/registrar-producto.dto'
import { EditarProductoDto } from '../dto/editar-producto.dto'

interface ProductoResponse {
  id: string
  producerProfileId: string
  nombre: string
  descripcion: string
  categoria: string
  precio: number
  cantidad: number
  disponible: boolean
  creadoEn: Date
  actualizadoEn: Date
}

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly registrarProductoUseCase: RegistrarProductoUseCase,
    private readonly editarProductoUseCase: EditarProductoUseCase,
    private readonly eliminarProductoUseCase: EliminarProductoUseCase,
    private readonly listarProductosUseCase: ListarProductosUseCase,
    private readonly producerProfileService: ProducerProfileService
  ) {}

  /** Registrar producto — solo PROVEEDOR */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  @HttpCode(HttpStatus.CREATED)
  async registrar(
    @Body() dto: RegistrarProductoDto,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<ProductoResponse> {
    const perfil = await this.producerProfileService.findOwn(usuario.id)
    const producto = await this.registrarProductoUseCase.execute({
      producerProfileId: perfil.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      categoria: dto.categoria,
      precio: dto.precio,
      cantidad: dto.cantidad,
      disponible: dto.disponible ?? true,
    })
    return this.toResponse(producto)
  }

  /** Listar productos disponibles — público */
  @Get()
  async listarDisponibles(): Promise<ProductoResponse[]> {
    const productos = await this.listarProductosUseCase.ejecutarDisponibles()
    return productos.map((p) => this.toResponse(p))
  }

  /** Buscar por nombre — público (ruta estática, debe ir antes de /:id) */
  @Get('buscar')
  async buscar(@Query('q') q: string): Promise<ProductoResponse[]> {
    if (!q || q.trim().length < 2) return []
    const productos = await this.listarProductosUseCase.ejecutarBusqueda(q)
    return productos.map((p) => this.toResponse(p))
  }

  /** Mis productos — proveedor autenticado (ruta estática, debe ir antes de /:id) */
  @Get('mis-productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  async misProductos(@CurrentUser() usuario: UsuarioAutenticado): Promise<ProductoResponse[]> {
    const perfil = await this.producerProfileService.findOwn(usuario.id)
    const productos = await this.listarProductosUseCase.ejecutarPorProductor(perfil.id)
    return productos.map((p) => this.toResponse(p))
  }

  /** Editar producto — solo propietario */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  async editar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditarProductoDto,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<ProductoResponse> {
    const perfil = await this.producerProfileService.findOwn(usuario.id)
    const producto = await this.editarProductoUseCase.execute({
      id,
      producerProfileId: perfil.id,
      ...dto,
    })
    return this.toResponse(producto)
  }

  /** Eliminar producto — solo propietario */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROVEEDOR)
  @HttpCode(HttpStatus.OK)
  async eliminar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<{ message: string }> {
    const perfil = await this.producerProfileService.findOwn(usuario.id)
    await this.eliminarProductoUseCase.execute(id, perfil.id)
    return { message: 'Producto eliminado correctamente.' }
  }

  /** Ver producto por id — público (ruta dinámica, siempre al final) */
  @Get(':id')
  async verProducto(@Param('id', ParseUUIDPipe) id: string): Promise<ProductoResponse> {
    const productos = await this.listarProductosUseCase.ejecutarDisponibles()
    const producto = productos.find((p) => p.id === id)
    if (!producto) throw new NotFoundException('Producto no encontrado.')
    return this.toResponse(producto)
  }

  private toResponse(p: {
    id: string
    producerProfileId: string
    nombre: string
    descripcion: string
    categoria: string
    precio: number
    cantidad: number
    disponible: boolean
    creadoEn: Date
    actualizadoEn: Date
  }): ProductoResponse {
    return {
      id: p.id,
      producerProfileId: p.producerProfileId,
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      cantidad: p.cantidad,
      disponible: p.disponible,
      creadoEn: p.creadoEn,
      actualizadoEn: p.actualizadoEn,
    }
  }
}
