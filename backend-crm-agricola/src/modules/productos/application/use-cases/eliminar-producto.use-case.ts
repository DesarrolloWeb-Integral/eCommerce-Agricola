import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PRODUCTO_REPOSITORY_PORT } from '../../ports/out/producto-repository.port'
import type { ProductoRepositoryPort } from '../../ports/out/producto-repository.port'

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort
  ) {}

  async execute(id: string, producerProfileId: string): Promise<void> {
    const producto = await this.productoRepository.findById(id)
    if (!producto) throw new NotFoundException('Producto no encontrado.')

    if (producto.producerProfileId !== producerProfileId) {
      throw new ForbiddenException('No tienes permiso para eliminar este producto.')
    }

    await this.productoRepository.delete(id)
  }
}
