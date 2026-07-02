import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import { EstadoCuenta } from 'src/modules/usuarios/domain/value-objects/estado-cuenta.enum'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'agro_usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  name!: string

  @Column({
    type: 'text',
    name: 'last_name',
  })
  lastName!: string

  @Column({
    type: 'text',
    unique: true,
  })
  email!: string

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  phone!: string | null

  @Column({
    type: 'text',
    name: 'password',
  })
  passwordHash!: string

  @Column({
    name: 'refresh_token_hash',
    type: 'text',
    nullable: true,
  })
  refreshTokenHash!: string | null

  @Column({
    type: 'enum',
    enum: RolUsuario,
    enumName: 'rol_usuario_enum',
    default: RolUsuario.CLIENTE,
  })
  role!: RolUsuario

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive!: boolean

  @Column({
    type: 'enum',
    enum: EstadoCuenta,
    enumName: 'estado_cuenta_enum',
    name: 'estado_cuenta',
    default: EstadoCuenta.ACTIVA,
  })
  estadoCuenta!: EstadoCuenta

  @Column({
    type: 'timestamp with time zone',
    name: 'privacy_notice_accepted_at',
    nullable: true,
  })
  privacyNoticeAcceptedAt!: Date | null

  @Column({
    type: 'varchar',
    length: 30,
    name: 'privacy_notice_version',
    nullable: true,
  })
  privacyNoticeVersion!: string | null

  @Column({
    type: 'boolean',
    name: 'optional_purposes_allowed',
    default: false,
  })
  optionalPurposesAllowed!: boolean

  @Column({
    type: 'timestamp with time zone',
    name: 'optional_purposes_updated_at',
    nullable: true,
  })
  optionalPurposesUpdatedAt!: Date | null

  @Column({
    type: 'timestamp with time zone',
    name: 'cancellation_requested_at',
    nullable: true,
  })
  cancellationRequestedAt!: Date | null

  @Column({
    type: 'timestamp with time zone',
    name: 'cancelled_at',
    nullable: true,
  })
  cancelledAt!: Date | null

  @Column({
    type: 'timestamp with time zone',
    name: 'personal_data_disassociated_at',
    nullable: true,
  })
  personalDataDisassociatedAt!: Date | null

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null
}
