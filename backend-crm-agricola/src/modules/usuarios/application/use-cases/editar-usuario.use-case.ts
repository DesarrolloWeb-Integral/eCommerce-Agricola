import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Usuario } from '../../domain/entities/usuario'
import { USUARIO_REPOSITORY_PORT } from '../../ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from '../../ports/out/usuario-repository.port'

export interface EditarUsuarioInput {
  id: string
  name?: string
  lastName?: string
  email?: string
  phone?: string
}

@Injectable()
export class EditarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async execute(input: EditarUsuarioInput): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(input.id)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    const email = input.email?.trim().toLowerCase()
    const phone = input.phone?.trim()

    await this.validateUniqueData(usuario.id, email, phone)

    usuario.updateProfile({
      name: input.name?.trim(),
      lastName: input.lastName?.trim(),
      email,
      phone,
    })

    return this.usuarioRepository.save(usuario)
  }

  private async validateUniqueData(
    currentUserId: string,
    email?: string,
    phone?: string
  ): Promise<void> {
    const [usuarioConMismoEmail, usuarioConMismoTelefono] = await Promise.all([
      email ? this.usuarioRepository.findByEmailIncludingDeleted(email) : Promise.resolve(null),
      phone ? this.usuarioRepository.findByPhoneIncludingDeleted(phone) : Promise.resolve(null),
    ])

    if (usuarioConMismoEmail && usuarioConMismoEmail.id !== currentUserId) {
      throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.')
    }

    if (usuarioConMismoTelefono && usuarioConMismoTelefono.id !== currentUserId) {
      throw new ConflictException('Ya existe un usuario registrado con este número telefónico.')
    }
  }
}
