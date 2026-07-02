import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
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
import { CategoriaProducto } from '../../../../domain/value-objects/categoria-producto.enum'
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

interface ProductoDetalleResponse extends ProductoResponse {
  productor: {
    id: string
    businessName: string
    generalLocation: string | null
    contactPhone: string | null
    contactEmail: string | null
    socialLinks: Record<string, string>
  }
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
      usuarioId: usuario.id,
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

  /** Buscar por nombre — público */
  @Get('buscar')
  async buscar(@Query('q') q: string): Promise<ProductoResponse[]> {
    if (!q || q.trim().length < 2) return []
    // Rechazar entradas maliciosas
    if (q.length > 100) throw new BadRequestException('La búsqueda es demasiado larga.')
    const sanitized = q.replace(/[<>"'%;()&+]/g, '').trim()
    if (!sanitized) throw new BadRequestException('Entrada inválida.')
    const productos = await this.listarProductosUseCase.ejecutarBusqueda(sanitized)
    return productos.map((p) => this.toResponse(p))
  }

  /** Filtrar por categoría — público */
  @Get('categoria/:categoria')
  async porCategoria(@Param('categoria') categoria: string): Promise<ProductoResponse[]> {
    const cat = categoria.toUpperCase() as CategoriaProducto
    if (!Object.values(CategoriaProducto).includes(cat)) {
      throw new BadRequestException('Categoría inválida.')
    }
    const productos = await this.listarProductosUseCase.ejecutarPorCategoria(cat)
    return productos.map((p) => this.toResponse(p))
  }

  /** Mis productos — proveedor autenticado */
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
      usuarioId: usuario.id,
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
    await this.eliminarProductoUseCase.execute({
      id,
      usuarioId: usuario.id,
      producerProfileId: perfil.id,
    })
    return { message: 'Producto eliminado correctamente.' }
  }

  /** Ver detalle de producto con info del productor — público */
  @Get(':id')
  async verProducto(@Param('id', ParseUUIDPipe) id: string): Promise<ProductoDetalleResponse> {
    const productos = await this.listarProductosUseCase.ejecutarDisponibles()
    const producto = productos.find((p) => p.id === id)
    if (!producto) throw new NotFoundException('Producto no encontrado.')
    const productor = await this.producerProfileService.findPublicById(producto.producerProfileId)
    return {
      ...this.toResponse(producto),
      productor: {
        id: productor.id,
        businessName: productor.businessName,
        generalLocation: productor.generalLocation,
        contactPhone: productor.contactPhone,
        contactEmail: productor.contactEmail,
        socialLinks: productor.socialLinks,
      },
    }
  }

  /** Productos de un productor específico — público, usado en el perfil público */
  @Get('productor/:producerProfileId')
  async porProductor(
    @Param('producerProfileId', ParseUUIDPipe) producerProfileId: string
  ): Promise<ProductoResponse[]> {
    const productor = await this.producerProfileService.findPublicById(producerProfileId)

    if (!productor.isAvailable) {
      return []
    }

    const productos = await this.listarProductosUseCase.ejecutarPorProductor(producerProfileId)
    // Solo se muestran los disponibles al público
    return productos.filter((p) => p.disponible && p.cantidad > 0).map((p) => this.toResponse(p))
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
