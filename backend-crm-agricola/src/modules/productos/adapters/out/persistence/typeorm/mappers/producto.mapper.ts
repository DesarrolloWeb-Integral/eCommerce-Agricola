import { Producto } from '../../../../../domain/entities/producto'
import { ProductoEntity } from '../entities/producto.entity'
import { CategoriaProducto } from '../../../../../domain/value-objects/categoria-producto.enum'

export class ProductoMapper {
  static toDomain(entity: ProductoEntity): Producto {
    return new Producto(
      entity.id,
      entity.producerProfileId,
      entity.nombre,
      entity.descripcion,
      entity.categoria,
      Number(entity.precio),
      entity.cantidad,
      entity.disponible,
      entity.creadoEn,
      entity.actualizadoEn
    )
  }

  static toPersistence(domain: Producto): Partial<ProductoEntity> {
    return {
      id: domain.id,
      producerProfileId: domain.producerProfileId,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      categoria: domain.categoria as CategoriaProducto,
      precio: domain.precio,
      cantidad: domain.cantidad,
      disponible: domain.disponible,
    }
  }
}
