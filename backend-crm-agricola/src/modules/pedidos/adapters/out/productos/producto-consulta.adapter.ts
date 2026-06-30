import { Inject, Injectable } from '@nestjs/common'

import {
  PRODUCTO_REPOSITORY_PORT,
  type ProductoRepositoryPort,
} from 'src/modules/productos/ports/out/producto-repository.port'
import type {
  ProductoConsultaPort,
  ProductoParaPedido,
} from '../../../ports/out/producto-consulta.port'

@Injectable()
export class ProductoConsultaAdapter implements ProductoConsultaPort {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort
  ) {}

  async findById(id: string): Promise<ProductoParaPedido | null> {
    const producto = await this.productoRepository.findById(id)

    if (!producto) {
      return null
    }

    return {
      id: producto.id,
      producerProfileId: producto.producerProfileId,
      precio: producto.precio,
      cantidad: producto.cantidad,
      disponible: producto.disponible,
    }
  }

  async reservarStock(id: string, quantity: number): Promise<boolean> {
    return this.productoRepository.reservarStock(id, quantity)
  }

  async liberarStock(id: string, quantity: number): Promise<void> {
    await this.productoRepository.liberarStock(id, quantity)
  }
}
