import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { CategoriaProducto } from '../../../../../domain/value-objects/categoria-producto.enum'

@Entity({ name: 'agro_producto' })
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'producer_profile_id' })
  producerProfileId!: string

  @Column({ type: 'text' })
  nombre!: string

  @Column({ type: 'text' })
  descripcion!: string

  @Column({
    type: 'enum',
    enum: CategoriaProducto,
    enumName: 'categoria_producto_enum',
  })
  categoria!: CategoriaProducto

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio!: number

  @Column({ type: 'int' })
  cantidad!: number

  @Column({ type: 'boolean', name: 'disponible', default: true })
  disponible!: boolean

  @CreateDateColumn({ name: 'created_at' })
  creadoEn!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  actualizadoEn!: Date
}
