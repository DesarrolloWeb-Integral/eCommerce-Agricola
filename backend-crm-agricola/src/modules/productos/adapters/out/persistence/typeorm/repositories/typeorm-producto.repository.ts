import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { SelectQueryBuilder } from 'typeorm'

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
    const entity = await this.createAvailableProductQuery()
      .andWhere('producto.id = :id', { id })
      .getOne()

    return entity ? ProductoMapper.toDomain(entity) : null
  }

  async findByProducerProfileId(producerProfileId: string): Promise<Producto[]> {
    const entities = await this.repo.find({
      where: { producerProfileId },
      order: { nombre: 'ASC' },
    })

    return entities.map((entity) => ProductoMapper.toDomain(entity))
  }

  async findAllDisponibles(): Promise<Producto[]> {
    const entities = await this.createAvailableProductQuery()
      .orderBy('producto.nombre', 'ASC')
      .getMany()

    return entities.map((entity) => ProductoMapper.toDomain(entity))
  }

  async searchByNombre(nombre: string): Promise<Producto[]> {
    const entities = await this.createAvailableProductQuery()
      .andWhere('producto.nombre ILIKE :nombre', { nombre: `%${nombre}%` })
      .orderBy('producto.nombre', 'ASC')
      .take(30)
      .getMany()

    return entities.map((entity) => ProductoMapper.toDomain(entity))
  }

  async findByCategoria(categoria: CategoriaProducto): Promise<Producto[]> {
    const entities = await this.createAvailableProductQuery()
      .andWhere('producto.categoria = :categoria', { categoria })
      .orderBy('producto.nombre', 'ASC')
      .getMany()

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
      .andWhere(
        `EXISTS (
          SELECT 1
          FROM producer_profiles profile
          INNER JOIN agro_usuario usuario ON profile.user_id = usuario.id::text
          WHERE profile.id = "producer_profile_id"
          AND profile.is_active = true
          AND usuario.is_active = true
          AND usuario.estado_cuenta <> 'CANCELADA'
        )`
      )
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

  private createAvailableProductQuery(): SelectQueryBuilder<ProductoEntity> {
    return this.repo
      .createQueryBuilder('producto')
      .innerJoin('producer_profiles', 'profile', 'profile.id = producto.producer_profile_id')
      .innerJoin('agro_usuario', 'usuario', 'profile.user_id = usuario.id::text')
      .where('producto.disponible = true')
      .andWhere('producto.cantidad > 0')
      .andWhere('profile.is_active = true')
      .andWhere('usuario.is_active = true')
      .andWhere("usuario.estado_cuenta <> 'CANCELADA'")
  }
}
