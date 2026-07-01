import { Producto } from '../../domain/entities/producto'
import { CategoriaProducto } from '../../domain/value-objects/categoria-producto.enum'

export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT')

export interface ProductoRepositoryPort {
  save(producto: Producto): Promise<Producto>
  findById(id: string): Promise<Producto | null>
  findByProducerProfileId(producerProfileId: string): Promise<Producto[]>
  findAllDisponibles(): Promise<Producto[]>
  searchByNombre(nombre: string): Promise<Producto[]>
  findByCategoria(categoria: CategoriaProducto): Promise<Producto[]>
  reservarStock(id: string, quantity: number): Promise<boolean>
  liberarStock(id: string, quantity: number): Promise<void>
  delete(id: string): Promise<void>
}
