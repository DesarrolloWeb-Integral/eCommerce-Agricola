import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { Producto } from '../../domain/entities/producto'
import { PRODUCTO_REPOSITORY_PORT } from '../../ports/out/producto-repository.port'
import type { ProductoRepositoryPort } from '../../ports/out/producto-repository.port'

export interface RegistrarProductoInput {
  producerProfileId: string
  nombre: string
  descripcion: string
  categoria: string
  precio: number
  cantidad: number
  disponible: boolean
}

@Injectable()
export class RegistrarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort
  ) {}

  async execute(input: RegistrarProductoInput): Promise<Producto> {
    const now = new Date()
    const producto = new Producto(
      randomUUID(),
      input.producerProfileId,
      input.nombre.trim(),
      input.descripcion.trim(),
      input.categoria,
      input.precio,
      input.cantidad,
      input.disponible,
      now,
      now
    )
    return this.productoRepository.save(producto)
  }
}
