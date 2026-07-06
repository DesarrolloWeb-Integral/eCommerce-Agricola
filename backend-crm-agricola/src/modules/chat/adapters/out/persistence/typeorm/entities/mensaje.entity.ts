import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('mensajes')
@Index(['conversacionId'])
export class MensajeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'conversacion_id' })
  conversacionId!: string

  @Column({ type: 'uuid', name: 'remitente_id' })
  remitenteId!: string

  @Column({ type: 'text' })
  contenido!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
