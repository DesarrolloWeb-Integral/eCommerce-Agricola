import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Producto } from '../../domain/entities/producto'
import { PRODUCTO_REPOSITORY_PORT } from '../../ports/out/producto-repository.port'
import type { ProductoRepositoryPort } from '../../ports/out/producto-repository.port'
import { RegistrarLogUseCase } from '../../../auditoria/application/use-cases/registrar-log.use-case'

export interface EditarProductoInput {
  id: string
  usuarioId: string
  producerProfileId: string
  nombre?: string
  descripcion?: string
  categoria?: string
  precio?: number
  cantidad?: number
  disponible?: boolean
}

@Injectable()
export class EditarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort,
    private readonly registrarLogUseCase: RegistrarLogUseCase
  ) {}

  async execute(input: EditarProductoInput): Promise<Producto> {
    const producto = await this.productoRepository.findById(input.id)
    if (!producto) throw new NotFoundException('Producto no encontrado.')

    if (producto.producerProfileId !== input.producerProfileId) {
      throw new ForbiddenException('No tienes permiso para editar este producto.')
    }

    if (input.nombre !== undefined) producto.nombre = input.nombre.trim()
    if (input.descripcion !== undefined) producto.descripcion = input.descripcion.trim()
    if (input.categoria !== undefined) producto.categoria = input.categoria
    if (input.precio !== undefined) producto.precio = input.precio
    if (input.cantidad !== undefined) producto.cantidad = input.cantidad
    if (input.disponible !== undefined) producto.disponible = input.disponible
    producto.actualizadoEn = new Date()

    await this.registrarLogUseCase.execute({
      usuarioId: input.usuarioId,
      accion: 'EDITAR_PRODUCTO',
      recursoAfectado: `Producto:${input.id}`,
      detalle: `Producto editado. Nombre: ${producto.nombre}`,
    })

    return this.productoRepository.save(producto)
  }
}
