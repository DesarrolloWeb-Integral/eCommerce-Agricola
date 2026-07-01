import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { Producto } from '../../../../../domain/entities/producto'
import { CategoriaProducto } from '../../../../../domain/value-objects/categoria-producto.enum'
import { ProductoRepositoryPort } from '../../../../../ports/out/producto-repository.port'
import { ProductoEntity } from '../entities/producto.entity'
import { ProductoMapper } from '../mappers/producto.mapper'

@Injectable()
export class TypeormProductoRepository implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly repo: Repository<ProductoEntity>
  ) {}

  async save(producto: Producto): Promise<Producto> {
    const entity = ProductoMapper.toPersistence(producto)
    const saved = await this.repo.save(entity)
    return ProductoMapper.toDomain(saved)
  }

  async findById(id: string): Promise<Producto | null> {
    const entity = await this.repo.findOneBy({ id })
    return entity ? ProductoMapper.toDomain(entity) : null
  }

  async findByProducerProfileId(producerProfileId: string): Promise<Producto[]> {
    const entities = await this.repo.findBy({ producerProfileId })
    return entities.map((entity) => ProductoMapper.toDomain(entity)) // línea 29
  }

  async findAllDisponibles(): Promise<Producto[]> {
    const entities = await this.repo.findBy({ disponible: true })
    return entities.map((entity) => ProductoMapper.toDomain(entity)) // línea 34
  }

  async searchByNombre(nombre: string): Promise<Producto[]> {
    const entities = await this.repo.find({
      where: { nombre: ILike(`%${nombre}%`), disponible: true },
      order: { nombre: 'ASC' },
      take: 30,
    })
    return entities.map((entity) => ProductoMapper.toDomain(entity)) // línea 43
  }

  async findByCategoria(categoria: CategoriaProducto): Promise<Producto[]> {
    const entities = await this.repo.find({
      where: { categoria, disponible: true },
      order: { nombre: 'ASC' },
    })
    return entities.map((entity) => ProductoMapper.toDomain(entity))
  }

  async reservarStock(id: string, quantity: number): Promise<boolean> {
    const resultado = await this.repo
      .createQueryBuilder()
      .update()
      .set({
        cantidad: () => '"cantidad" - :quantity',
      })
      .where('id = :id', { id })
      .andWhere('cantidad >= :quantity', { quantity })
      .andWhere('disponible = true')
      .execute()

    return (resultado.affected ?? 0) === 1
  }

  async liberarStock(id: string, quantity: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({
        cantidad: () => '"cantidad" + :quantity',
      })
      .where('id = :id', { id })
      .setParameters({ quantity })
      .execute()
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
