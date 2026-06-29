import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('producer_profiles')
export class ProducerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'varchar', unique: true })
  userId!: string

  // ─── Campos PÚBLICOS ─────────────────────────────────────────────────────

  @Column({ name: 'business_name', type: 'varchar', length: 120 })
  businessName!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ name: 'general_location', type: 'varchar', length: 200, nullable: true })
  generalLocation!: string | null

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone!: string | null

  @Column({ name: 'contact_email', type: 'varchar', length: 254, nullable: true })
  contactEmail!: string | null

  @Column({ name: 'social_links', type: 'jsonb', nullable: true, default: '{}' })
  socialLinks!: Record<string, string>

  // ─── Campos PRIVADOS ─────────────────────────────────────────────────────

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes!: string | null

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
