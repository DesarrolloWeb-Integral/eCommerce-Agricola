import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
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
  })
  phone!: string

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
