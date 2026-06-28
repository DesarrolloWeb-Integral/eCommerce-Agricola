import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { Usuario } from '../../domain/entities/usuario'
import { PASSWORD_HASHER_PORT } from '../../ports/out/password-hasher.port'
import type { PasswordHasherPort } from '../../ports/out/password-hasher.port'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'
import { RolUsuario } from '../../domain/value-objects/rol-usuario.enum'

export interface RegistrarUsuarioInput {
  name: string
  lastName: string
  email: string
  phone: string
  password: string
  role: RolUsuario
}

@Injectable()
export class RegistrarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(input: RegistrarUsuarioInput): Promise<Usuario> {
    const email = input.email.trim().toLowerCase()
    const phone = input.phone.trim()

    await this.validateUniqueData(email, phone)
    this.validatePublicRole(input.role)

    const passwordHash = await this.passwordHasher.hash(input.password)

    const now = new Date()

    const usuario = new Usuario(
      randomUUID(),
      input.name.trim(),
      input.lastName.trim(),
      email,
      phone,
      passwordHash,
      null,
      input.role,
      true,
      now,
      now,
      null
    )

    return this.usuarioRepository.save(usuario)
  }

  private async validateUniqueData(email: string, phone: string): Promise<void> {
    const [usuarioConMismoEmail, usuarioConMismoTelefono] = await Promise.all([
      this.usuarioRepository.findByEmailIncludingDeleted(email),
      this.usuarioRepository.findByPhoneIncludingDeleted(phone),
    ])

    if (usuarioConMismoEmail) {
      if (!usuarioConMismoEmail.isActive) {
        throw new ConflictException(
          'Existe una cuenta desactivada con este correo electrónico. Solicita la reactivación de tu cuenta.'
        )
      }

      throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.')
    }

    if (usuarioConMismoTelefono) {
      if (!usuarioConMismoTelefono.isActive) {
        throw new ConflictException(
          'Existe una cuenta desactivada con este número telefónico. Solicita la reactivación de tu cuenta.'
        )
      }

      throw new ConflictException('Ya existe un usuario registrado con este número telefónico.')
    }
  }

  private validatePublicRole(role: RolUsuario): void {
    const allowedRoles = [RolUsuario.CLIENTE, RolUsuario.PROVEEDOR]

    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException('No es posible registrarse con el rol de administrador.')
    }
  }
}
