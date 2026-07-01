import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { EstadoPedido } from '../../../../../domain/value-objects/estado-pedido.enum'

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => Number(value),
}

export interface PedidoItemPersistence {
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

@Entity({ name: 'agro_pedido' })
export class PedidoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'client_id' })
  clientId!: string

  @Column({ type: 'uuid', name: 'producer_profile_id' })
  producerProfileId!: string

  @Column({ type: 'jsonb', default: () => "'[]'" })
  items!: PedidoItemPersistence[]

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  subtotal!: number

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    enumName: 'estado_pedido_enum',
    default: EstadoPedido.PENDIENTE,
  })
  estado!: EstadoPedido

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
