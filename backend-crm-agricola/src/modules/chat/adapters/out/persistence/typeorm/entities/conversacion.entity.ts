import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('conversaciones')
@Index(['clienteId', 'producerProfileId', 'productoId', 'pedidoId'])
export class ConversacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'cliente_id' })
  clienteId!: string

  @Column({ type: 'uuid', name: 'producer_profile_id' })
  producerProfileId!: string

  @Column({ type: 'uuid', name: 'producto_id', nullable: true })
  productoId!: string | null

  @Column({ type: 'uuid', name: 'pedido_id', nullable: true })
  pedidoId!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
