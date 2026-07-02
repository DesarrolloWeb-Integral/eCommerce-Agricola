import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'agro_auditoria' })
export class AuditoriaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // Puede ser el UUID del usuario o 'SISTEMA' / 'ANONIMO' para fallos de login externos
  @Column({ type: 'text', name: 'usuarioId' })
  usuarioId!: string

  @Column({ type: 'text' })
  accion!: string

  @Column({ type: 'text', name: 'recurso_afectado' })
  recursoAfectado!: string

  @Column({ type: 'text', nullable: true })
  detalle!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
