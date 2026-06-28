import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
// Ajusta esta importación según tu entidad User real
// import { User } from '../../users/entities/user.entity';

@Entity('producer_profiles')
export class ProducerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // Relación 1:1 con el usuario propietario
  @Column({ name: 'user_id', unique: true })
  userId!: string

  // @OneToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  // ─── Campos PÚBLICOS (visibles para clientes) ────────────────────────────

  @Column({ name: 'business_name', length: 120 })
  businessName!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  /** Ubicación general: estado / municipio, sin dirección exacta */
  @Column({ name: 'general_location', length: 200, nullable: true })
  generalLocation!: string | null

  /** Teléfono de contacto público (opcional) */
  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone!: string | null

  /** Correo de contacto público (puede diferir del correo de cuenta) */
  @Column({ name: 'contact_email', length: 254, nullable: true })
  contactEmail!: string | null

  /** WhatsApp, Facebook, Instagram, etc. — guardado como JSON */
  @Column({ name: 'social_links', type: 'jsonb', nullable: true, default: '{}' })
  socialLinks!: Record<string, string>

  // ─── Campos PRIVADOS (solo el propio productor los ve) ──────────────────

  /** Notas internas del productor; nunca se exponen en la vista pública */
  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes!: string | null

  @Column({ name: 'is_active', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
