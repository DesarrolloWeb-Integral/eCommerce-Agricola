import { Inject, Injectable } from '@nestjs/common'
import { Producto } from '../../domain/entities/producto'
import { CategoriaProducto } from '../../domain/value-objects/categoria-producto.enum'
import { PRODUCTO_REPOSITORY_PORT } from '../../ports/out/producto-repository.port'
import type { ProductoRepositoryPort } from '../../ports/out/producto-repository.port'

@Injectable()
export class ListarProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly productoRepository: ProductoRepositoryPort
  ) {}

  async ejecutarDisponibles(): Promise<Producto[]> {
    return this.productoRepository.findAllDisponibles()
  }

  async ejecutarPorProductor(producerProfileId: string): Promise<Producto[]> {
    return this.productoRepository.findByProducerProfileId(producerProfileId)
  }

  async ejecutarBusqueda(nombre: string): Promise<Producto[]> {
    return this.productoRepository.searchByNombre(nombre)
  }

  async ejecutarPorCategoria(categoria: CategoriaProducto): Promise<Producto[]> {
    return this.productoRepository.findByCategoria(categoria)
  }
}
