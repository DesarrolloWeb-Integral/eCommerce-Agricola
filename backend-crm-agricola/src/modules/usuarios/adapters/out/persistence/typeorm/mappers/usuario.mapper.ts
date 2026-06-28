import { Usuario } from '../../../../../domain/entities/usuario'
import { UsuarioEntity } from '../entities/usuario.entity'

export class UsuarioMapper {
  static toDomain(usuarioEntity: UsuarioEntity): Usuario {
    return new Usuario(
      usuarioEntity.id,
      usuarioEntity.name,
      usuarioEntity.lastName,
      usuarioEntity.email,
      usuarioEntity.phone,
      usuarioEntity.passwordHash,
      usuarioEntity.refreshTokenHash,
      usuarioEntity.role,
      usuarioEntity.isActive,
      usuarioEntity.createdAt,
      usuarioEntity.updatedAt,
      usuarioEntity.deletedAt
    )
  }

  static toPersistence(usuario: Usuario): UsuarioEntity {
    const usuarioEntity = new UsuarioEntity()

    usuarioEntity.id = usuario.id
    usuarioEntity.name = usuario.name
    usuarioEntity.lastName = usuario.lastName
    usuarioEntity.email = usuario.email
    usuarioEntity.phone = usuario.phone
    usuarioEntity.passwordHash = usuario.passwordHash
    usuarioEntity.refreshTokenHash = usuario.refreshTokenHash
    usuarioEntity.role = usuario.role
    usuarioEntity.isActive = usuario.isActive
    usuarioEntity.createdAt = usuario.createdAt
    usuarioEntity.updatedAt = usuario.updatedAt
    usuarioEntity.deletedAt = usuario.deletedAt

    return usuarioEntity
  }
}
