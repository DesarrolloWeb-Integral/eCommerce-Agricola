import { Producto } from '../../domain/entities/producto'

export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT')

export interface ProductoRepositoryPort {
  save(producto: Producto): Promise<Producto>
  findById(id: string): Promise<Producto | null>
  findByProducerProfileId(producerProfileId: string): Promise<Producto[]>
  findAllDisponibles(): Promise<Producto[]>
  searchByNombre(nombre: string): Promise<Producto[]>
  delete(id: string): Promise<void>
}
