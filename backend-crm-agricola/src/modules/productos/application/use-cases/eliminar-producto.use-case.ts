import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PRODUCTO_REPOSITORY_PORT } from '../../ports/out/producto-repository.port'
import type { ProductoRepositoryPort } from '../../ports/out/producto-repository.port'
import { RegistrarLogUseCase } from '../../../auditoria/application/use-cases/registrar-log.use-case'

export interface EliminarProductoInput {
  id: string
  usuarioId: string
  producerProfileId: string
}

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort,
    private readonly registrarLogUseCase: RegistrarLogUseCase
  ) {}

  async execute(input: EliminarProductoInput): Promise<void> {
    const producto = await this.productoRepository.findById(input.id)
    if (!producto) throw new NotFoundException('Producto no encontrado.')

    if (producto.producerProfileId !== input.producerProfileId) {
      throw new ForbiddenException('No tienes permiso para eliminar este producto.')
    }

    await this.registrarLogUseCase.execute({
      usuarioId: input.usuarioId,
      accion: 'ELIMINAR_PRODUCTO',
      recursoAfectado: `Producto:${input.id}`,
      detalle: `Producto eliminado. Nombre anterior: ${producto.nombre}`,
    })

    await this.productoRepository.delete(input.id)
  }
}
